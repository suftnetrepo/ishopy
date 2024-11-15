import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const useLocation = () => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'Your app needs access to your location',
                            buttonPositive: 'OK',
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getLocation();
                    } else {
                        console.log('Location permission denied');
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (Platform.OS === 'ios') {
                getLocation(); 
            }
        };

        const getLocation = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                error => {
                    console.error(error);
                },
                { enableHighAccuracy: true, timeout: 90000, maximumAge: 10000 } 
            );
        };

        requestLocationPermission();
    }, []);

    return location || {};
};

export default useLocation;
