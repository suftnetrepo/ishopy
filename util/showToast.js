import Toast from 'react-native-toast-message';

const showToast = (type, text1, text2, position = 'bottom', visibilityTime = 4000) => {
    Toast.show({
        type: type, // Types: 'success', 'error', 'info'
        text1: text1,
        text2: text2,
        position: position, // Can be 'top' or 'bottom'
        visibilityTime: visibilityTime, // Time the toast is visible
    });
};

export default showToast;