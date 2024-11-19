/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
	View,
	Text,
	StyleSheet,
	StatusBar,
	SafeAreaView,
	Modal,
	TouchableOpacity,
	Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
	FONT_FAMILY,
	MATERIAL_COLORS,
	MATERIAL_FONTS_SIZES,
	VERBS,
} from "../constants";
import { useStripe } from "@stripe/stripe-react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import {
	formatCurrency, formatAddress, currencySymbolMapper,
	generatePaymentId,
	getStripe,
	formatPaymentMethodName,
} from '../util/helpers';
import { useAppContext } from "../components/hooks/AppContext";
import CartItems from "./CartItems";
import { useCart } from "../components/hooks/CartProvider";
import ProgressDialog from "../components/ProgressDialog";
import { createCustomer, placeOrder } from "../api";
import { ScrollView } from "react-native-gesture-handler";
import Spacer from "../components/Spacer";

const CheckOut = ({ navigation, route }) => {
	const { seller, user, token } = useAppContext()
	const { cart = [], clearCartItems } = useCart()
	const [modalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const { shippingMethod, paymentMethod } = route.params
	const [orderId, setOrderId] = useState("");
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const [publishableKey, setPublishableKey] = useState({
		publishable_key: '',
		stripe_customer_id: ''
	});
	const [paymentSheetStatus, setPaymentSheetStatus] = useState(true);

	const deliveryCharges = parseFloat(shippingMethod.deliveryCharges)
	const taxRate = seller.tax_rate > 0 ? (seller.tax_rate / 100) : 0
	const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
	const total_tax = taxRate > 0 ? subtotal * taxRate : 0;
	const grand_total = subtotal + deliveryCharges + total_tax;
	const reference = generatePaymentId()

	const paymentName = paymentMethod.name

	const requestBody = useMemo(() => ({
		currency: currencySymbolMapper(seller.currency),
		stripe_user_id: getStripe(seller.delivery_payment_provider),
		amount: grand_total,
	}), [seller, grand_total]);

	const initializePaymentSheet = useCallback(async () => {
		try {
			setPaymentSheetStatus(false)
			const { error, success, data } = await createCustomer(requestBody, VERBS.POST, token);

			if (!success) {
				console.error('Customer creation failed:', error.message);
				return;
			}

			const { client_secret, ephemeralKey, customer, publishable_key } = data;
			const paymentSheetError = await initializeStripePaymentSheet({
				client_secret,
				ephemeralKey,
				customer
			});

			if (paymentSheetError) {
				console.error('Payment sheet initialization failed:', paymentSheetError);
				return;
			}

			setPublishableKey((pre) => {
				return {
					...pre,
					publishable_key,
					stripe_customer_id: customer
				}
			});

		} catch (error) {
			console.error('An unexpected error occurred:', error.message);
		}
	}, [requestBody, token, user]);

	const initializeStripePaymentSheet = async ({ client_secret, ephemeralKey, customer }) => {
		const { error } = await initPaymentSheet({
			merchantDisplayName: 'iShopy, Inc.',
			merchantIdentifier: 'merchant.com.stripe.react.native',
			customerId: customer,
			customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: client_secret,
			allowsDelayedPaymentMethods: true,
			defaultBillingDetails: {
				name: `${user.firstname} ${user.lastname}`,
				email: `${user.email}`,
				country: user.shipping_address?.country_code || 'us',
				reference

			},
			customFlow: false,
			style: 'automatic',
		});

		return error;
	};

	useEffect(() => {
		if (paymentName === 'Stripe' && paymentSheetStatus) {
			initializePaymentSheet();
		}
	}, [initializePaymentSheet, paymentName, paymentSheetStatus]);


	const submitOrder = useCallback(async () => {
		if (paymentName === "Stripe") {
			const { error } = await presentPaymentSheet();
			if (error) {
				console.error('Payment failed:', error);
				return;
			}
		}

		const order = createOrderPayload(publishableKey);
		await placeAndClearOrder(order);
	}, [presentPaymentSheet, paymentName, publishableKey]);

	const createOrderPayload = (publishableKey) => {
		const workflowsOrder = [
			{
				description: '',
				send_email: true,
				send_notification: false,
				status: 'Pending'
			},
			{
				description: '',
				send_email: true,
				send_notification: false,
				status: 'Processing'
			}
		];
		const isCashMethod = ["CashOnDelivery", "PickUp"].includes(paymentMethod.name);
		const payments = [{
			amount: grand_total,
			method: isCashMethod ? 'Cash' : 'Card',
			provider: paymentMethod.name,
			reference: generatePaymentId(),
			stripe_customer_id: paymentName === "Stripe" ? publishableKey?.stripe_customer_id : ''
		}];

		const items = cart.map(item => ({
			item_id: item._id,
			name: item.name,
			unit: item.unit,
			price: item.price,
			quantity: item.quantity
		}))

		const customer = {
			name: `${user.firstname} ${user.lastname}`,
			email: user.email
		}

		const order = {
			deliveryCharges,
			order_status: 'Pending',
			payment_status: isCashMethod ? 'UnPaid' : 'Paid',
			total: subtotal,
			total_tax: total_tax,
			tax: taxRate,
			grand_total,
			user: user._id,
			items,
			workflows: workflowsOrder,
			suid: seller._id,
			order_channel: 'Delivery',
			payments,
			fcm_token: '',
			customer_fcm_token: '',
			shipping_method: shippingMethod.name,
			shipping_address: formatAddress(user.shipping_address),
			customer,
			seller: {
				name: seller.name,
				email: seller.email,
				mobile: seller.mobile,
				currency: seller.currency
			}
		};

		return order
	};

	const placeAndClearOrder = async (order) => {
		setLoading(true);

		try {
			const { data, success } = await placeOrder(order, VERBS.POST, token, null);
			if (success) {
				setOrderId(data);
				setModalVisible(true);
				await clearCartItems();
			}
		} catch (error) {
			console.error("Error fetching sellers:", error);
		} finally {
			setLoading(false);
		}
	};

	const closeModal = () => {
		setModalVisible(false);
		navigation.replace("bottomNavigator");
	};
	const RenderPaymentMethod = () => {
		return (
			<>
				<View style={styles.labelContainer}>
					<Text style={{ ...styles.labelName }}>Payment Method</Text>
				</View>
				<View style={styles.paymentMethodCard} >
					<View style={styles.rowContainer}>
						{
							(paymentMethod.name === "CashOnDelivery") ? (<Icon
								name="cash"
								size={30}
								color={MATERIAL_COLORS.grey[800]}
							/>) : (paymentMethod.name === "Stripe") && (
								<Icon
									name="credit-card"
									size={30}
									color={MATERIAL_COLORS.grey[800]}
								/>
							)
						}
						<Text style={styles.paymentMethodName}>{formatPaymentMethodName(paymentMethod.name)}</Text>
					</View>
					<Icon
						name="check-circle-outline"
						size={30}
						color={MATERIAL_COLORS.green[800]}
					/>

				</View>
			</>
		)
	}
	const RenderShippingMethod = () => {

		return (
			<>
				<View style={styles.labelContainer}>
					<Text style={{ ...styles.labelName }}>Delivery Method</Text>
				</View>
				<View style={styles.shippingMethodCardContainer}>
					<View style={{ ...styles.rowContainer, justifyContent: 'space-between' }}>
						<View style={styles.rowContainer}>
							<Text style={styles.shippingMethodName}>{shippingMethod.name}</Text>
						</View>
						<Text style={styles.shippingMethodPrice}>{formatCurrency(seller.currency, shippingMethod.deliveryCharges)}</Text>
					</View>
					<View>
						<Text style={styles.shippingMethodDescription}>{shippingMethod.description}</Text>
					</View>
				</View>
			</>
		)
	}
	const RenderAddress = () => {
		return (
			<>
				<View style={styles.labelContainer}>
					<Text style={{ ...styles.labelName }}>Delivery Address</Text>
				</View>
				<View style={{ ...styles.rowContainer, ...styles.addressCard }}>
					<Icon
						name="map-marker"
						size={35}
						color={MATERIAL_COLORS.grey[700]}
					/>
					<Text style={styles.addressText}>
						{formatAddress(user.shipping_address)}
					</Text>
				</View>
			</>
		)
	}
	const RenderPayContainer = () => (
		<>
			<View style={styles.payOrderContainer}>
				<View style={{ ...styles.columnContainer }}>
					<View style={{ ...styles.rowContainer, justifyContent: 'space-between', width: "100%" }}>
						<Text style={styles.summaryText}>Subtotal ({cart.length}) items: </Text>
						<Text style={styles.summaryText}>{formatCurrency(seller.currency, subtotal)}</Text>
					</View>
					<View style={{ ...styles.rowContainer, justifyContent: 'space-between', width: "100%" }}>
						<Text style={styles.summaryText}>Delivery Charges: </Text>
						<Text style={styles.summaryText}> {formatCurrency(seller.currency, deliveryCharges)}</Text>
					</View>
					{
						seller.tax_rate > 0 && (
							<View style={{ ...styles.rowContainer, justifyContent: 'space-between', width: "100%" }}>
								<Text style={styles.summaryText}>Tax({seller.tax_rate})% : </Text>
								<Text style={styles.summaryText}> {formatCurrency(seller.currency, total_tax)}</Text>
							</View>
						)
					}
					<View style={{ ...styles.rowContainer, justifyContent: 'space-between', width: "100%" }}>
						<Text style={{ ...styles.summaryText, fontWeight: 'bold', fontSize: MATERIAL_FONTS_SIZES.font_size_xlarge }}>Total: </Text>
						<Text style={{ ...styles.summaryText, fontWeight: 'bold', fontSize: MATERIAL_FONTS_SIZES.font_size_xlarge }}>{formatCurrency(seller.currency, grand_total)}</Text>
					</View>
				</View>

			</View>

		</>

	)
	const RenderModalDialogue = () => (
		<Modal animationType="fade" transparent={true} visible={modalVisible}>
			<View style={styles.modalBackground}>
				<View style={styles.modalContent}>
					<View style={styles.modalBody}>
						<Icon
							name="check-circle"
							size={90}
							color={MATERIAL_COLORS.green[400]}
						/>
						<Text
							style={{
								marginVertical: 10,
								fontFamily: FONT_FAMILY.crimson_text_regular,
								fontSize: MATERIAL_FONTS_SIZES.font_size_large,
								textAlign: "center",
							}}
						>
							{`Order ID:# ${orderId.slice(-6)} \n\n Thank you, ${user.firstname} ${user.lastname}! Your order has been successfully placed and is now being processed. An email confirmation has been sent to ${user.email}.`}
						</Text>
						<TouchableOpacity onPress={closeModal} style={styles.close}>

							<Text
								style={{
									color: MATERIAL_COLORS.grey[1],
									fontFamily: FONT_FAMILY.crimson_text_regular,
									fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
									textAlign: 'center'
								}}
							>
								Home
							</Text>

						</TouchableOpacity>
					</View>
					<View style={styles.modalFooter}>
						<Text
							style={{
								color: MATERIAL_COLORS.grey[400],
								fontSize: MATERIAL_FONTS_SIZES.font_size_micro,
							}}
						>
							Version 0.0.1
						</Text>
					</View>
				</View>
			</View>
		</Modal>
	)
	const RenderStripeProvider = () => (
		<StripeProvider stripeAccountId={requestBody.stripe_user_id} publishableKey={publishableKey.publishable_key} merchantIdentifier='merchant.com.stripe.react.native' urlScheme='stripe-example'
			setReturnUrlSchemeOnAndroid={true} >
			<Spacer />
			<View style={styles.header}>
				<View style={styles.iconContainer}>
					<Icon
						name="arrow-left"
						size={30}
						color={MATERIAL_COLORS.grey[700]}
						onPress={() => navigation.goBack()}
					/>
				</View>
				<Text style={styles.headerText}>CheckOut</Text>
				<View style={{ flex: 1 }} />
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				<RenderAddress />
				<RenderShippingMethod />
				<RenderPaymentMethod />
				<CartItems />
				<RenderPayContainer />
			</ScrollView>
			<RenderModalDialogue />
			<ProgressDialog isVisible={loading} />
		</StripeProvider>
	)

	const RenderCashProvider = () => (
		<>
			<Spacer />
			<View style={styles.header}>
				<View style={styles.iconContainer}>
					<Icon
						name="arrow-left"
						size={30}
						color={MATERIAL_COLORS.grey[700]}
						onPress={() => navigation.goBack()}
					/>
				</View>
				<Text style={styles.headerText}>CheckOut</Text>
				<View style={{ flex: 1 }} />
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				<RenderAddress />
				<RenderShippingMethod />
				<RenderPaymentMethod />
				<CartItems navigation={navigation} show={true} />
				<RenderPayContainer />
			</ScrollView>
			<RenderModalDialogue />
			<ProgressDialog isVisible={loading} />
		</>
	)

	return (<SafeAreaView style={{ flex: 1, flexDirection : 'column', justifyContent:'center', alignItems:'center' }}>
		{
			(paymentName === "Stripe") ? (
				<RenderStripeProvider />
			) : (
				<RenderCashProvider />
			)
		}
		<TouchableOpacity
			onPress={submitOrder}
			style={styles.continueContainer}
		>
			<Text style={styles.continue}>Place Order</Text>
		</TouchableOpacity>
	</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	addressCard: {
		alignItems: "center",
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[1],
		borderRadius: 16,
		borderWidth: 1,
		elevation: 4,
		flexDirection: "row",
		justifyContent: 'flex-start',
		marginBottom: 8,
		marginHorizontal: 16,
		padding: 8
	},
	addressText: {
		color: MATERIAL_COLORS.grey[800],
		flex: 1,
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_medium
	},
	close: {
		backgroundColor: MATERIAL_COLORS.cyan[600],
		borderColor: MATERIAL_COLORS.cyan[600],
		borderRadius: 30,
		borderWidth: 1,
		marginTop: 8,
		paddingHorizontal: 20,
		paddingVertical: 5,
		width: '100%'
	},
	columnContainer: {
		alignItems: 'flex-start',
		flexDirection: "column",
		justifyContent: 'flex-start',
		marginBottom: 16,
		paddingBottom: 56,
		width: "100%"
	},
	container: {
		backgroundColor: MATERIAL_COLORS.grey[100],
		flex: 1,
		position: "relative",
	},
	continue: {
		color: MATERIAL_COLORS.grey[1],
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		fontWeight: "bold",
		paddingVertical: 10,
		textAlign: "center"
	},
	continueContainer: {
		backgroundColor: MATERIAL_COLORS.cyan[500],
		borderColor: MATERIAL_COLORS.cyan[500],
		borderRadius: 30,
		borderWidth: 1,
		alignItems: "center",
		bottom: 8,
		flexDirection: "column",
		justifyContent: "center",
		position: "absolute",
		width: "90%",

	},
	header: {
		alignItems: "center",
		backgroundColor: MATERIAL_COLORS.grey[1],
		flexDirection: "row",
		height: 56,
		justifyContent: "flex-start",
		marginBottom: 8,
		paddingHorizontal: 20,
		paddingVertical: 8
	},
	headerText: {
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		marginHorizontal: 8,
	},
	iconContainer: {
		alignItems: "center",
		borderColor: MATERIAL_COLORS.grey[500],
		borderRadius: 24,
		borderWidth: 1,
		flexDirection: "column",
		height: 48,
		justifyContent: "center",
		width: 48,
	},
	labelContainer: {
		alignItems: 'flex-start',
		flexDirection: "column",
		justifyContent: 'flex-start',
		marginBottom: 8,
		marginHorizontal: 16
	},
	labelName: {
		color: MATERIAL_COLORS.grey[500],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_small,
		marginLeft: 4
	},
	modalBackground: {
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
		flex: 1,
		justifyContent: "center",
	},
	modalBody: {
		alignItems: "center",
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		width: "100%",
	},
	modalContent: {
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 5,
		height: "70%",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 10,
		width: "80%",
	},
	modalFooter: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "flex-end",
		paddingHorizontal: 10,
		paddingVertical: 10,
		width: "100%",
	},
	modalHeader: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "flex-end",
		paddingHorizontal: 0,
		paddingVertical: 5,
		width: "100%",
	},
	modalText: {
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		lineHeight: 24,
		marginBottom: 20,
		textAlign: "left",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	payOrderContainer: {
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[1],
		borderRadius: 16,
		borderWidth: 1,
		elevation: 1,
		marginBottom: 8,
		marginHorizontal: 16,
		paddingHorizontal: 8,
		paddingTop: 8
	},
	paymentMethodCard: {
		alignItems: "center",
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[1],
		borderRadius: 16,
		borderWidth: 1,
		elevation: 2,
		flexDirection: "row",
		justifyContent: 'space-between',
		marginBottom: 8,
		marginHorizontal: 16,
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	paymentMethodName: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		marginLeft: 4
	},
	rowContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "flex-start"
	},
	shippingMethodCardContainer: {
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[1],
		borderRadius: 16,
		borderWidth: 1,
		elevation: 4,
		marginBottom: 8,
		marginHorizontal: 16,
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	shippingMethodDescription: {
		color: MATERIAL_COLORS.grey[700],
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal
	},
	shippingMethodName: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
	},
	shippingMethodPrice: {
		color: MATERIAL_COLORS.cyan[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
		fontWeight: 'bold'
	},
	summaryText: {
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		marginVertical: 2,
	}
});

export default CheckOut;
