import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux"; // Import Provider from react-redux
import ReactDOM from "react-dom/client";
import store from "./store/store";
import React from "react";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Wrap your App component with Provider and pass the Redux store */}
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
