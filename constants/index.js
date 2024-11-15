import images from "./images";
import store from "./store";
import {
  MATERIAL_COLORS,
  MATERIAL_FONTS_SIZES,
  MATERIAL_SPACING,
  GENERIC_SIZES,
  FONT_FAMILY,
  SHADOWS
} from "./material";

const VERBS = {
  POST : 'POST',
  GET : 'GET',
  DELETE : 'DELETE'
}

const ORDER_STATUS =[  
    "All",  
    "Pending",    
    "Dispatched",         
    "Delivered",      
]

const TAGS =['Vegetable', 'Frozen Foods', 'Drinks', 'Cooking Oils', 'Fruits', 'Rice', 'Beans', 'Free delivery']

export {
  store,
  images,
  MATERIAL_COLORS,
  MATERIAL_FONTS_SIZES,
  MATERIAL_SPACING,
  GENERIC_SIZES,
  FONT_FAMILY,
  SHADOWS,
  VERBS,
  ORDER_STATUS,
  TAGS
};
