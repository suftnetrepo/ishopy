import { STRIPE_PAYMENT } from "./apiUrl";
import { postJSON } from "./base";

const createCustomer = async (body, method, token = null, queryParams = null) => {
    return await postJSON(STRIPE_PAYMENT.paymentIntent, body, method,  token, queryParams);
};

export {
    createCustomer
}