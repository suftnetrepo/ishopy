import React, { useState } from 'react';
import { YStack, XStack, StyledCard, StyledSeparator, StyledImage, FlexStyledImage, StyledCycle, StyledBadge, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from "../components/hooks/AppContext";
import { ensureHttps, formatAddress } from '../util/helpers';
import { useNavigation } from '@react-navigation/native';
import Spacer from '../components/Spacer';
import { fontStyles, theme } from '../util/theme'
import { StyledSearchBar } from '../components/package/searchBar';
import { FlatList } from 'react-native';
import MyCurrentLocation from '../components/MyCurrentLocation';
import SliderWithKnobLabel from '../components/SliderWithKnobLabel';
import { useSearchSeller } from '../components/hooks/useSearchSeller';

const SearchSeller = () => {
	const navigator = useNavigation()
	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const { user, from, setFrom, saveSeller } = useAppContext()
	const { data, loading, error, resetHandler, searchHandler, fetchAndLoadSellers, handleSellerSelect } = useSearchSeller()

	const handleSelect = (seller) => {
		const canPlaceOrder = handleSellerSelect(seller, saveSeller)
		if (canPlaceOrder) {
			navigator.navigate("bottomNavigator")
		} else {
			setIsDialogVisible(true)
		}
	}

	const RenderHeader = () => (
		<XStack justifyContent='space-between'
			backgroundColor={theme.colors.gray[1]}
			paddingVertical={8}
			alignItems='center' paddingHorizontal={16}>
			<MyCurrentLocation />
			<XStack justifyContent='flex-start'
				alignItems='center'>
				{
					(from) && (
						<StyledCycle height={55} width={55} borderColor={theme.colors.gray[100]} backgroundColor={theme.colors.gray[100]}>
							<Ionicons
								name="close"
								size={30}
								color={theme.colors.gray[800]}
								onPress={() => {
									setFrom(false)
									navigator.navigate("bottomNavigator", { screen: 'Settings' })
								}}
							/>
						</StyledCycle>
					)
				}
				<StyledSpacer marginHorizontal={4} />
				<FlexStyledImage
					local={true}
					height={24}
					borderColor={theme.colors.gray[1]}
					imageUrl={require("../assets/images/jerur_logo_only.png")}
				/>
			</XStack>
		</XStack>
	)

	const RenderCard = ({ item }) => {
		const { name, secure_url, distance, address } = item

		return (
			<StyledCard
				borderRadius={16}
				marginBottom={16}
				borderColor={theme.colors.gray[300]}
				backgroundColor={theme.colors.gray[1]}
				shadow='light'
				marginHorizontal={8}
				pressable
				pressableProps={{
					onPress: () => handleSelect(item)
				}}
			>
				<XStack relative>
					<StyledImage
						borderTopLeftRadius={16}
						borderTopRightRadius={16}
						borderWidth={0}
						height={150}
						width={'100%'}
						local={secure_url ? false : true}
						imageUrl={ensureHttps(secure_url)}
					/>
				</XStack>
				<StyledSpacer marginVertical={2} />
				<YStack paddingHorizontal={16} paddingVertical={8}>
					<StyledText
						fontFamily={fontStyles.Roboto_Bold}
						fontWeight={theme.fontWeight.semiBold}
						color={theme.colors.gray[800]}
						fontSize={theme.fontSize.large}
					>
						{name}
					</StyledText>
					<XStack justifyContent='flex-start'
						paddingVertical={2}
						alignItems='center'>
						<Ionicons
							name="location-pin"
							size={32}
							color={theme.colors.gray[600]}
						/>
						<StyledSpacer marginHorizontal={2} />
						<StyledText
							flex={1}
							fontFamily={fontStyles.Roboto_Regular}
							fontWeight={theme.fontWeight.normal}
							color={theme.colors.gray[500]}
							fontSize={theme.fontSize.small}
						>
							{formatAddress(address)}
						</StyledText>
					</XStack>

				</YStack>
				<StyledSeparator
					line
					lineProps={{ borderTopColor: theme.colors.gray[100] }}
				/>
				<XStack
					justifyContent='flex-start'
					alignItems='center'
					paddingHorizontal={16}
					paddingVertical={16}
				>
					<StyledText
						fontFamily={fontStyles.Roboto_Regular}
						fontWeight={theme.fontWeight.normal}
						color={theme.colors.gray[300]}
						fontSize={theme.fontSize.normal}
					>
						DISTANCE
					</StyledText>
					<StyledSpacer flex={1} />
					<StyledBadge
						fontFamily={fontStyles.Roboto_Regular}
						color={theme.colors.indigo[800]}
						backgroundColor={theme.colors.gray[50]}
						fontWeight={theme.fontWeight.normal}
						fontSize={theme.fontSize.normal}
						paddingHorizontal={8}
						paddingVertical={1}
						borderRadius={15}
					>
						{distance}
					</StyledBadge>
				</XStack>
			</StyledCard>
		)
	}

	return (
		<StyledSafeAreaView flex={1}>
			<Spacer />
			<RenderHeader></RenderHeader>
			<YStack flex={1} paddingHorizontal={8}>
				<YStack paddingHorizontal={8} marginTop={8}>
					<StyledText
						fontFamily={fontStyles.Roboto_Bold}
						fontWeight={theme.fontWeight.normal}
						color={theme.colors.gray[800]}
						fontSize={theme.fontSize.xxxlarge}
					>
						Hello{user?.first_name && `, ${user?.first_name}`}
					</StyledText>
					<StyledText
						fontFamily={fontStyles.Roboto_Regular}
						fontWeight={theme.fontWeight.normal}
						color={theme.colors.purple[400]}
						fontSize={theme.fontSize.xxxlarge}
						paddingVertical={8}
					>
						{
							(data?.length === 0) ? (
								"No seller found within your current location."
							) : (
								<>
									{
										data?.length > 1 ? `${data?.length} Sellers are situated close to this location` : (<>
											One Seller is situated nearby
										</>)
									}
								</>
							)
						}
					</StyledText>
					{
						data?.length === 0 && (
							<>
								<SliderWithKnobLabel onSlidingComplete={async (value) => await fetchAndLoadSellers(value.toString())} />
								<StyledText
									fontFamily={fontStyles.Roboto_Regular}
									fontWeight={theme.fontWeight.normal}
									color={theme.colors.purple[400]}
									fontSize={theme.fontSize.normal}
									paddingVertical={12}
								> Try expanding the search radius</StyledText>
							</>
						)
					}

				</YStack>
				<StyledSpacer marginVertical={8} />
				<StyledSearchBar onReset={() => resetHandler()} onPress={(searchQuery) => searchQuery && searchHandler(searchQuery)} />
				<StyledSpacer marginVertical={8} />
				<FlatList
					data={data}
					initialNumToRender={100}
					showsVerticalScrollIndicator={false}
					keyExtractor={item => item._id}
					renderItem={({ item, index }) => (<RenderCard key={index} item={item} />)}
				/>
			</YStack>
			{(error) && (
				<StyledOkDialog title={error?.message} description='Please try again ' visible={true} onOk={resetHandler} />
			)}
			{loading && (
				<StyledSpinner />
			)}
			{
				isDialogVisible && (
					<StyledOkDialog
						visible={isDialogVisible}
						title={"Delivery Location Not in Range"}
						description="We're sorry, but your current location is not within our delivery radius. You won't be able to place an order at this time"
						onOK={() => setIsDialogVisible(false)}
					/>
				)
			}

		</StyledSafeAreaView>
	);
};


export default SearchSeller;
