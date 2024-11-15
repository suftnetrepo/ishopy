import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { MATERIAL_FONTS_SIZES, FONT_FAMILY, MATERIAL_COLORS } from '../constants';

const PrivacyConsent = () => {

    const handlePrivacyLink = () => {
        const url = 'https://arnaty-5aebe5112104.herokuapp.com/privacy-policy';

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Can't open this URL: ", url);
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                By registering, you agree to our
            </Text>
            <Text style={[
                styles.text, styles.underline
            ]}>
                Terms of Service
            </Text>
            <Text style={{...styles.text, marginHorizontal : 4}}>
                and
            </Text>
            <TouchableOpacity onPress={handlePrivacyLink}>
                <Text style={[
                    styles.text, styles.underline
                ]}>
                    Privacy Policy
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start',
        marginHorizontal:8,
        marginTop:8       
    },
    text: {
        color : MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text,
         fontSize: MATERIAL_FONTS_SIZES.font_size_medium
    },
    underline: {
        color: 'blue', textDecorationLine: 'underline'
    }

})

export default PrivacyConsent;
