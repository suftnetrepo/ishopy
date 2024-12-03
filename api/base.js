const defaultHeaders = {
  "content-type": "application/json",
};

export const postJSON = async (url, body, method, token = null, queryParams = null) => {
  try {
    const headers = { ...defaultHeaders };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestOptions = {
      method,
      headers,
    };

    if (method === "GET" && queryParams) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response}`);
    }
      
    const results = method === "DELETE" ? true : await response.json();

    return { success: true, data: results };
  } catch (error) {
    return { success: false, error };
  }
};