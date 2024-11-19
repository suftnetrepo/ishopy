/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
 } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES, MATERIAL_SPACING, FONT_FAMILY, VERBS } from "../constants";
import { useAppContext } from "../components/hooks/AppContext";
import SearchBar from "../components/SearchBar";
import { addressValidator } from "../validators/addressValidator";
import { updateCustomerShippingAddress } from "../api";
import { validate } from "../validators/validator";
import ProgressDialog from "../components/ProgressDialog";
import Spacer from "../components/Spacer";
import { isIOS } from "../util/helpers";

const EditShippingAddress = ({ navigation }) => {
  const { user, token, updateCurrentUser, from } = useAppContext()
  const [validationError, setValidationError] = useState({});
  const [fields, setFields] = useState(addressValidator.fields);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (user) {
      setFields((pre) => {
        return {
          ...(user && { ...user.shipping_address })
        }
      })
    }  
  }, [user])

  const onSubmit = async () => {
    const { hasError, errors } = validate(fields, addressValidator.rules);
    if (hasError) {
      setValidationError(errors);
      return;
    }

    try {
      setLoading(true)
      const { success } = await updateCustomerShippingAddress(fields, VERBS.POST, token)
      if (success) {
        const copyUser = {
          ...user,
          shipping_address: fields
        }
        updateCurrentUser(copyUser)
     
        if (from === "settings") {
          navigation.navigate("settings")
        }
      }
    } catch (e) {
      if(__DEV__)
      console.log(e);
    } finally {
      setLoading(false)
    }
  };

  const handleSelectedAddress = (selectedAddress) => { 
    setFields((prev) => {
      return {
        ...prev,
        addressline1:
          selectedAddress.address.country_code === 'gb' ||
            selectedAddress.address.country_code === 'us'
            ? selectedAddress.address.suburb
            : selectedAddress.address.place,
        addressline2: selectedAddress.address.county || selectedAddress.address.city,
        addressline3: selectedAddress.address.state_district || selectedAddress.address.state,
        postcode:
          selectedAddress.address.country_code === 'gb' ||
            selectedAddress.address.country_code === 'us'
            ? selectedAddress.address.postcode
            : '',
        country_code: selectedAddress.address.country_code,
        country: selectedAddress.address.country,
        longitude: parseFloat(selectedAddress.lon),
        latitude: parseFloat(selectedAddress.lat)
      };
    });
  };

  const RenderHeader = () => (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Icon
          name="arrow-left"
          size={30}
          color={MATERIAL_COLORS.grey[700]}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text
        style={{
          color: MATERIAL_COLORS.grey[700],
          fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
          marginLeft: 8
        }}
      >
        Edit Shipping Address
      </Text>
      <View style={{ flex: 1 }} />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Spacer />
      <RenderHeader />
      <View style={{ marginVertical: 4 }}></View>
      <View style={{ flex: 1, paddingHorizontal: 8, paddingBottom: 0, backgroundColor: MATERIAL_COLORS.grey[100] }}>
        <SearchBar handleSelectedAddress={handleSelectedAddress} />
        <View style={{ marginVertical: 32 }}></View>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={"always"}
          enableOnAndroid={true}
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={{ ...styles.inputContainer }}>
            <View style={styles.flexContainer}>
              <Text style={styles.label}>Street address</Text>
              <View style={{ ...styles.input }}>
                <TextInput
                  value={fields.addressline1}
                  placeholder="Street address"
                  placeholderTextColor={styles.placeholder}
                  maxLength={50}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={(value) =>
                    setFields({ ...fields, addressline1: value })
                  }
                  style={{ ...styles.inputText }}
                ></TextInput>
              </View>
              {validationError.addressline1 && (
                <ValidationMessage
                  message={validationError.addressline1.message}
                />
              )}
            </View>
            <View style={styles.flexContainer}>
              <Text style={styles.label}>Town</Text>
              <View style={{ ...styles.input }}>
                <TextInput
                  value={fields.addressline2}
                  placeholder="Town"
                  placeholderTextColor={styles.placeholder}
                  maxLength={50}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={(value) =>
                    setFields({ ...fields, addressline2: value })
                  }
                  style={{ ...styles.inputText }}
                ></TextInput>
              </View>
              {validationError.addressline2 && (
                <ValidationMessage message={validationError.addressline2.message} />
              )}
            </View>
            <View style={styles.flexContainer}>
              <Text style={styles.label}>County</Text>
              <View style={[styles.input]}>
                <TextInput
                  value={fields.addressline3}
                  placeholder="County"
                  placeholderTextColor={styles.placeholder}
                  maxLength={50}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={(value) => setFields({ ...fields, addressline3: value })}
                  style={{ ...styles.inputText }}
                ></TextInput>
              </View>
              {validationError.addressline3 && (
                <ValidationMessage message={validationError.addressline3.message} />
              )}
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.flexContainer}>
                <Text style={styles.label}>Postcode</Text>
                <View style={[styles.input]}>
                  <TextInput
                    value={fields.postcode}
                    placeholder="PostCode"
                    maxLength={25}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    returnKeyType="done"
                    onChangeText={(value) =>
                      setFields({ ...fields, postcode: value })
                    }
                    style={{ ...styles.inputText }}
                  ></TextInput>
                </View>
                {validationError.postcode && (
                  <ValidationMessage message={validationError.postcode.message} />
                )}
              </View>
              <View style={{ marginHorizontal: 4 }}></View>
              <View style={styles.flexContainer}>
                <Text style={styles.label}>Country</Text>
                <View style={[styles.input]}>
                  <TextInput
                    value={fields.country}
                    placeholder="Country"
                    maxLength={25}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    returnKeyType="done"
                    onChangeText={(value) =>
                      setFields({ ...fields, country: value })
                    }
                    style={{ ...styles.inputText }}
                  ></TextInput>
                </View>
                {validationError?.country && (
                  <ValidationMessage message={validationError?.country.message} />
                )}
              </View>
            </View>

            <View style={{ ...styles.columnContainer }}>
              <TouchableOpacity style={styles.button} onPress={onSubmit}>
                {loading && <ProgressDialog isVisible={loading} />}
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    fontFamily: FONT_FAMILY.crimson_text_regular,
    color: MATERIAL_COLORS.grey[800],
 
    marginLeft: 16
  },
  flexContainer: {
    flex: 1
  },
  container: {
    backgroundColor: MATERIAL_COLORS.grey[100],
    flex: 1,
    position: 'relative'
  },
  continue: {
    backgroundColor: MATERIAL_COLORS.cyan[500],
    borderColor: MATERIAL_COLORS.cyan[500],
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "90%",
  },
  continueContainer: {
    alignItems: "center",
    bottom: 8,
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center'

  },
  header: {
    alignItems: 'center',
    backgroundColor: MATERIAL_COLORS.grey[1],
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: MATERIAL_SPACING.spacing_medium_14,
    paddingVertical: 8
  },
  headerText: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  iconContainer: {
    alignItems: 'center',
    borderColor: MATERIAL_COLORS.grey[500],
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'column',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputContainer: {

  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: MATERIAL_COLORS.grey[500],
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  inputText: {
    flex: 1,
    fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
    color: MATERIAL_COLORS.grey[900],
    backgroundColor: MATERIAL_COLORS.grey[1],
    height: isIOS ? 40 : null
  },
  placeholder: {
    color: MATERIAL_COLORS.grey[600],
  },
  button: {
    width: "98%",
    backgroundColor: MATERIAL_COLORS.cyan[500],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 8,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    fontFamily: FONT_FAMILY.crimson_text_regular,
    color: MATERIAL_COLORS.grey[100],
    fontWeight: "bold",
  },
});

export default EditShippingAddress;
