import React, { useEffect, useState } from 'react';
import { fetchCatalogue } from '../../api';
import { VERBS } from '../../constants';

const useCatalogue = (seller_id) => {
    const [state, setState] = useState({
        data: [],
        error: null,
        loading: false
    });

    const fetchAndLoadCatalogues = async () => {
        setState(prev => ({
            ...prev,
            loading: true,
        }));
  
        const { data, success, error } = await fetchCatalogue(null, VERBS.GET, null, { suid: seller_id })

        if (success) {
            setState({
                data: data,
                loading: false
            })
        } else {
            setState({
                error: error,
                loading: false
            })
        }
    };

    useEffect(() => {
        fetchAndLoadCatalogues()
    }, [seller_id])

    return {
        ...state
    }

}

export { useCatalogue }