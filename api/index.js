// Import and export seller-related functionalities
import {
  fetchByFilter,
  fetchBySearch,
  fetchByCoordinates
} from "./sellers";
export {
  fetchByFilter,
  fetchBySearch,
  fetchByCoordinates
};

// Import and export customer-related functionalities
import {
  signUp,
  updateCustomer,
  updateCustomerShippingAddress,
  updateFcmToken,
  deleteCustomer,
} from "./customers";
export {
  signUp,
  updateCustomer,
  updateCustomerShippingAddress,
  updateFcmToken,
  deleteCustomer,
};

// Import and export order-related functionalities
import {
  placeOrder,
  fetchCustomerOrderByPaging,
} from "./orders";
export {
  placeOrder,
  fetchCustomerOrderByPaging,
};

// Import and export account-related functionalities
import {
  verifyAppCode,
  verifyUserByOtp,
  fetchCatalogue
} from "./accounts";
export {
  verifyAppCode,
  verifyUserByOtp,
  fetchCatalogue
};

// Import and export payment-related functionalities
import {
  createCustomer,
} from "./stripePayments";
export {
  createCustomer,
};

import {
  fetchProducts,
  fetchItemByPriceOffers
} from "./producrs";
export {
  fetchProducts,
  fetchItemByPriceOffers
};

import {
  fetchAddress,
} from "./address";
export {
  fetchAddress,
};
