import { HOST } from '../config'

export const CUSTOMER = {
    signUp: `${HOST}customer/create`,
    updateCustomerShippingAddress: `${HOST}customer/update-customer-shipping-address`,
    updateCustomer: `${HOST}customer/edit`,
    deleteCustomer: `${HOST}customer/delete`,
    updateFcmToken: `${HOST}customer/update-fcm-token`,
}

export const ORDER = {
    placeOrder: `${HOST}order/place-order`,
    fetchCustomerOrderByPaging: `${HOST}customer/fetch-customer-order-by-paging`  
}

export const STRIPE_PAYMENT = {
    paymentIntent: `${HOST}stripe-payment`  
}

export const SELLER = {  
    fetchByFilter: `${HOST}sellers/fetch-by-filter`,
    fetchBySearch: `${HOST}sellers/fetch-by-search`,
    fetchByCoordinates: `${HOST}sellers/fetch-by-coordinates`  
}

export const ACCOUNT = {
    verifyAppCode: `${HOST}customer/verify-email`,
    verifyUserByOtp: `${HOST}customer/verify-otp`,
    fetchCatalogue: `${HOST}sellers/fetch-catalogue`  
}

export const PRODUCT = {  
    fetchProducts: `${HOST}product/fetch-item-by-paging`,
    fetchItemByPriceOffers: `${HOST}product/fetch-item-by-price-offers`    
}
