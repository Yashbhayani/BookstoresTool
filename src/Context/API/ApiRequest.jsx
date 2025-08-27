// src/API/ApiRequest.js
const apiRequest = async ({ url, method = "GET", body = null, params = {} }) => {
  try {
    // Build query string from params
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    // Make request
    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        // if you still use token from sessionStorage
        //token: sessionStorage.getItem("token") || "",
      },
      body: body ? JSON.stringify(body) : null,
      credentials: "include", // ✅ required for backend cookies
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (e) {
    console.error("API Request Error:", e);
    throw e;
  }
};

export default apiRequest;
