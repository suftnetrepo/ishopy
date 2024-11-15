import AsyncStorage from "@react-native-async-storage/async-storage";

const save = async (data, key) => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    const parsedData = storedData ? JSON.parse(storedData) : [];

    const index = parsedData.findIndex((d) => d.id === data.id);
    if (index !== -1) {
      parsedData[index] = data;
    } else {
      parsedData.push(data);
    }

    await AsyncStorage.setItem(key, JSON.stringify(parsedData));
  } catch (error) {
    console.log(error);
  }
};

const remove = async (id, key) => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    const parsedData = storedData ? JSON.parse(storedData) : [];

    const filteredData = parsedData.filter((d) => d.id !== id);
    await AsyncStorage.setItem(key, JSON.stringify(filteredData));
  } catch (error) {
    console.log(error);
  }
};

const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);   
  } catch (error) {
    console.log(error);
  }
};

const fetch = async (key) => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    const parsedData = storedData ? JSON.parse(storedData) : [];
    return parsedData.sort(sortByDate);
  } catch (error) {
    console.log(error);
    return [];
  }
};

const clear = async () => {
  try {
    await AsyncStorage.clear(); 
  } catch (error) {
    console.log("Error clearing AsyncStorage:", error);
  }
};

const sortByDate = (a, b) => {
  return new Date(b.date) - new Date(a.date);
};
export { save, remove, fetch, clear, removeItem };
