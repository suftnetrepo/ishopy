import React, { useEffect, useState } from 'react';
import useLocation from './useLocation';
import { haversineDistance } from '../../util/helpers';
import { fetchByCoordinates } from '../../api';
import { VERBS } from '../../constants';

const useSearchSeller = () => {
    const {location, loading, error } = useLocation()
    const [state, setState] = useState({
        data: [],
        copy: [],
        mounted: false,
        error: null,
        loading: false
    });

    const fetchAndLoadSellers = async (radius = "20") => {

        setState(prev => ({
            ...prev,
            loading: true,
        }));

        if (location?.latitude && location?.longitude) {
            const queryParams = { latitude: location.latitude, longitude: location.longitude, radiusInRadians: radius }
            const { success, data, error } = await fetchByCoordinates(null, VERBS.GET, null, queryParams)

            if (success) {
                const sortedSellers = data.sellers.map((seller) => {
                    const haversine = haversineDistance(location, { latitude: seller.location.coordinates[1], longitude: seller.location.coordinates[0] })
                    return {
                        ...seller,
                        distance: haversine.formattedDistance,
                    };
                }).sort((a, b) => a.distance - b.distance);

                setState({
                    data: sortedSellers,
                    copy: sortedSellers,
                    loading: false
                })
            } else {
                setState({
                    error: error,
                    loading: false
                })
            }
        }

    };

    const handleSellerSelect = (seller, saveSeller) => {
        try {
            const haversine = haversineDistance(location, { latitude: seller.location.coordinates[1], longitude: seller.location.coordinates[0] })
            const canPlaceOrder = parseInt(seller?.maximum_delivery_distance) > haversine.distance

            seller = {
                ...seller,
                canPlaceOrder: true 
            }

            saveSeller({ seller })

            if (canPlaceOrder) {
                return true
            }

            return false
        } catch (error) {
            if (__DEV__)
                console.error(error)
        }
    }

    useEffect(() => {
        fetchAndLoadSellers();
    }, [location?.latitude, location?.longitude]);

    const searchHandler = async (searchQuery) => {
        if (searchQuery) {

            const normalizedSearch = searchQuery.trim().toLowerCase();
            const results = state.copy.filter(seller => {
                const sellerNameLower = seller.name.toLowerCase();
                return sellerNameLower.startsWith(normalizedSearch);
            });

            setState((prev) => {
                return {
                    ...prev,
                    data: results,
                }
            })
        }
    };

    const resetHandler = () => {
        fetchAndLoadSellers();
    }

    return {
        ...state,
        loading,
        error,
        searchHandler,
        resetHandler,
        fetchAndLoadSellers,
        handleSellerSelect
    }
}

export { useSearchSeller }