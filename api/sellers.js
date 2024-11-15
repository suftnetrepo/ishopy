import { SELLER } from "./apiUrl";
import { postJSON } from "./base";

const fetchCatalogues = async (body, method, token = null, queryParams = null) => {
    return await postJSON(SELLER.fetchCatalogues, body, method, token, queryParams);
};

const fetchByFilter = async (body, method, token = null, queryParams = null) => {
    return await postJSON(SELLER.fetchByFilter, body, method, token, queryParams);
};

const fetchBySearch = async (body, method, token = null, queryParams = null) => {
    return await postJSON(SELLER.fetchBySearch, body, method, token, queryParams);
};

const fetchByCoordinates = async (body, method, token = null, queryParams = null) => {
    return await postJSON(SELLER.fetchByCoordinates, body, method, token, queryParams);
};

export {
    fetchByCoordinates,
    fetchBySearch,
    fetchByFilter,
    fetchCatalogues
}