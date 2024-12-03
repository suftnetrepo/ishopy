import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const useLocation = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'Your app needs access to your location to provide accurate information.',
                            buttonPositive: 'OK',
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getLocation();
                    } else {
                        handlePermissionDenied();
                    }
                } catch (err) {
              
                    setLoading(false); 
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
                    setLoading(false); 
                },
                error => {
                   
                    handlePermissionDenied();
                },
                { enableHighAccuracy: true, timeout: 90000, maximumAge: 10000 }
            );
        };

        const handlePermissionDenied = () => {
            setError(new Error("The app requires access to your location to provide the nearby stores. Please enable location permissions in your device settings."))
            setLoading(false); 
        };

        requestLocationPermission();
    }, []);

    return { location, loading, error };
};

export default useLocation;
