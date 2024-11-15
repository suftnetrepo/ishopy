const fetchAddress = async (query) => {
    return await searchAddress(query);
};

async function searchAddress(query) {
  const params = {
    q: query,
    format: 'json',
    addressdetails: 1,
    polygon_geojson: 0,
  };

  const queryString = new URLSearchParams(params).toString();
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${queryString}`,
      requestOptions,
    );
    const results = await response.json();
    return { success: true, data: results };
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    return { success: false, error };
  }
}

export {
    fetchAddress    
}