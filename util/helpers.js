import { Platform, Dimensions } from "react-native";

export const isIOS = Platform.OS === "ios";
export const isAndroid = !isIOS;
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export const isIphoneX =
  isIOS &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (windowHeight === 812 ||
    windowWidth === 812 ||
    windowHeight === 896 ||
    windowWidth === 896);


const getTimeDifference = (date) => {
  const now = new Date();
  const endDate = new Date(date);
  const difference = now.getTime() - endDate.getTime();
  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (days < 30) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

const getGreetings = () => {
  const currentTime = new Date().getHours();
  let greeting;

  if (currentTime < 12) {
    greeting = "Good morning";
  } else if (currentTime < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return greeting;
};
function formatAddress(address) {
 
  let formattedAddress = '';

  if (address?.addressline1) {
    formattedAddress += address.addressline1;
  }

  if (address?.postcode) {
    if (formattedAddress) {
      formattedAddress += ', ' + address.postcode;
    } else {
      formattedAddress += address.postcode;
    }
  }

  if (address?.country) {
    if (formattedAddress) {
      formattedAddress += ', ' + address.country;
    } else {
      formattedAddress += address.country;
    }
  }

  return formattedAddress;
}

function percentage(currentAmount, targetAmount) {
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100).toFixed(0);
  return percentage
}
function calculateDaysLeft(startTimestamp, endTimestamp) {
  const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  const startDate = new Date(parseInt(startTimestamp));
  const endDate = new Date(parseInt(endTimestamp));

  const timeDifference = endDate.getTime() - startDate.getTime();
  const daysLeft = Math.ceil(timeDifference / oneDayMilliseconds);

  return daysLeft;
}
function formatCurrency(currencySymbol, amount) {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    return amount;
  }

  const formattedAmount = currencySymbol + numericAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

  return formattedAmount;
}
const getStripe = (payment_provider) => {
  const provider =
    payment_provider.find((provider) => provider.name === "Stripe") || {};
  return provider.stripe_user_id;
};
function currencySymbolMapper(currencySymbol) {
  const currencyMap = {
    "£": "gbp",
    "$": "usd",
    "aed": "aed",
    "afn": "afn",
    "all": "all",
    "amd": "amd",
    "usdc": "usdc",
    "btn": "btn",
    "ghs": "ghs",
    "eek": "eek",
    "lvl": "lvl",
    "svc": "svc",
    "vef": "vef",
    "ltl": "ltl",
    "sll": "sll",
  };

  if (currencySymbol in currencyMap) {
    return currencyMap[currencySymbol];
  } else {
    return "gbp";
  }
}
const timeStampConverter = (timestamp, localFormat = "en-GB") => {
  const formattedDate = new Date(parseInt(timestamp));
  return dateConverter(formattedDate.toLocaleDateString(localFormat));
};

function getDayMonthName(unixTimestamp) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const date = new Date(unixTimestamp * 1000);
  const dayName = daysOfWeek[date.getUTCDay()];
  const dayNumber = date.getUTCDate();
  const monthName = monthsOfYear[date.getUTCMonth()];

  return {
    dayName: dayName,
    dayNumber: dayNumber,
    monthName: monthName
  };
}

const dateConverter = (stringDate) => {
  const parts = stringDate.split("/");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

function haversineDistance(coords1, coords2) {
   
  function toRad(x) {
    return (x * Math.PI) / 180;
  }
  const R = 6371; // Earth radius in km
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);

  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; 
  const formattedDistance = distance > 1 ? `${distance.toFixed(2)} km` : `${Math.round(distance * 1000)} meters`
   
  return { formattedDistance, distance };
}

const calculateCartTotal = (currency, cart) => {
  let total = 0;

  for (const item of cart) {
    const subtotal = item.quantity * item.price;
    total += subtotal;
  }

  return formatCurrency(currency, total);
};

const cartTotal = (cart) => {
  let total = 0;

  for (const item of cart) {
    const subtotal = item.quantity * item.price;
    total += subtotal;
  }

  return total;
};

function formatAddressParts(address) {
  const { suburb, city, state, postcode, country, country_code, place } = address;
  const addressPartsToInclude = [];

  if (country_code === 'us' || country_code === 'gb') {
    const postcodeOrZipCode = postcode || '';
    addressPartsToInclude.push(suburb, city, state, postcodeOrZipCode, country);
  } else {
    addressPartsToInclude.push(place, city, state, country);
  }

  return addressPartsToInclude.join(', ');
}

function completeAddress(address) {
  if (!address) return;
  let completeAddress = '';

  if (address.addressLine1) {
    completeAddress += address.addressLine1 + ', ';
  }

  if (address.county) {
    completeAddress += address.county + ', ';
  }

  if (address.town) {
    completeAddress += address.town + ', ';
  }

  if (address.country) {
    completeAddress += address.country + ', ';
  }

  if (address.postcode) {
    completeAddress += address.postcode;
  }

  return completeAddress;
}

function generatePaymentId() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

const formatPaymentMethodName = (name) => {
		switch (name) {
			case 'CashOnDelivery':
				return 'Cash on delivery'
		}
		return name
	}

  function convertToShortDate(timestampString) {
  try {
    // Parse the timestamp string into a Date object
    const timestamp = new Date(timestampString);
    
    // Get the year, month, and day components
    const year = timestamp.getFullYear();
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month as it's zero-based
    const day = timestamp.getDate().toString().padStart(2, '0');
    
    // Create the short date string (YYYY-MM-DD)
    const shortDate = `${day}-${month}-${year}`;
    
    return shortDate;
  } catch (error) {
    return "Invalid timestamp format";
  }
}

function ensureHttps(url) {
  if (!url) return url; // If no URL is provided, return as is.
  
  // Check if the URL starts with 'http://' and replace with 'https://'
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  return url; // Return the original URL if it's already secure or doesn't need changes.
}

export {cartTotal, ensureHttps, convertToShortDate, formatPaymentMethodName, generatePaymentId, completeAddress, formatAddressParts, calculateCartTotal, haversineDistance, getDayMonthName, timeStampConverter, currencySymbolMapper, getStripe, getTimeDifference, getGreetings, formatAddress, percentage, calculateDaysLeft, formatCurrency };
