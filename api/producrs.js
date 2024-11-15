import { PRODUCT } from "./apiUrl";
import { postJSON } from "./base";

const fetchProducts = async (body, method, token = null, queryParams = null) => {
    return await postJSON(PRODUCT.fetchProducts, body, method, token, queryParams);
};

const fetchItemByPriceOffers = async (body, method, token = null, queryParams = null) => {
    return await postJSON(PRODUCT.fetchItemByPriceOffers, body, method, token, queryParams);
};

export {
   fetchProducts,
   fetchItemByPriceOffers
}