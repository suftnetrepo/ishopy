import { CUSTOMER } from "./apiUrl";
import { postJSON } from "./base";

const signUp = async (body, method, token = null, queryParams = null) => {
    return await postJSON(CUSTOMER.signUp, body,method, token, queryParams);
};

const updateCustomerShippingAddress = async (body, method, token = null, queryParams = null) => {
    return await postJSON(CUSTOMER.updateCustomerShippingAddress, body, method, token, queryParams);
};

const updateCustomer = async (body, method, token = null, queryParams = null) => {
    return await postJSON(CUSTOMER.updateCustomer, body, method, token, queryParams);
};

const deleteCustomer = async (body, method, token = null, queryParams = null) => {
    return await postJSON(CUSTOMER.deleteCustomer, body, method, token, queryParams);
};

const updateFcmToken = async (body, method, token = null, queryParams = null) => {
    return await postJSON(CUSTOMER.updateFcmToken, body, method, token, queryParams);
};

export {
    signUp,
    updateCustomerShippingAddress,
    updateCustomer,
    deleteCustomer,
    updateFcmToken
}