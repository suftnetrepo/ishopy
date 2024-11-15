import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * useAppFocus
 * Detects when the app goes to the background or comes to the foreground.
 *
 * @returns {boolean} isAppFocused - True if the app is in the foreground.
 */
function useAppFocus() {
    const [isAppFocused, setIsAppFocused] = useState(true);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const handleAppStateChange = nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App has come to the foreground
                setIsAppFocused(true);
            } else if (
                appState.current === 'active' &&
                nextAppState.match(/inactive|background/)
            ) {
                // App has gone to the background
                setIsAppFocused(false);
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    return isAppFocused;
}

export default useAppFocus;
