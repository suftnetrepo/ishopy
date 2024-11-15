import { ORDER } from "./apiUrl";
import { postJSON } from "./base";

const placeOrder = async (body, method, token = null, queryParams = null) => {
    return await postJSON(ORDER.placeOrder, body, method, token, queryParams);
};

const fetchCustomerOrderByPaging = async (body, method, token = null, queryParams = null) => {
    return await postJSON(ORDER.fetchCustomerOrderByPaging, body, method, token, queryParams);
};

export {
    placeOrder,
    fetchCustomerOrderByPaging   
}