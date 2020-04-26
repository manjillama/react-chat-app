let SERVER_URL = "/";

if (process.env.REACT_APP_ENV === "DEV") {
  SERVER_URL = "http://localhost:5000";
}
export { SERVER_URL };
