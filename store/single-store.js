import AsyncStorage from "@react-native-async-storage/async-storage";

const saveOne = async ( key, data) => {
  try {
    await AsyncStorage.setItem(key, data ? JSON.stringify(data) : "");
  } catch (error) {
    return false;
  }
};

const getOne = async (key) => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    const parsedData = storedData ? JSON.parse(storedData) : false;
    return parsedData;
  } catch (error) {
    return false;
  }
};

export { saveOne, getOne };
