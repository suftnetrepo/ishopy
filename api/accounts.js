import { ACCOUNT } from "./apiUrl";
import { postJSON } from "./base";

const verifyAppCode = async (body, method, token = null, queryParams = null) => {
    return await postJSON(ACCOUNT.verifyAppCode, body, method , token, queryParams);
};

const verifyUserByOtp = async (body, method, token = null, queryParams = null) => {
    return await postJSON(ACCOUNT.verifyUserByOtp, body, method, token, queryParams);
};

const fetchCatalogue = async (body, method, token = null, queryParams = null) => {
    return await postJSON(ACCOUNT.fetchCatalogue, body, method, token, queryParams);
};

export {
    verifyAppCode,
    verifyUserByOtp,
    fetchCatalogue
}