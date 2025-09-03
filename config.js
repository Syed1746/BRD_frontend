export const LocalUrl = "http://localhost:5000"
export const LiveUrl = "https://brd-backend-o7n9.onrender.com"

export const BASE_URL =
    process.env.NODE_ENV === "development" ? LocalUrl : LiveUrl;
console.log("Current url", BASE_URL);