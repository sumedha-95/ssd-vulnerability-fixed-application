import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// components
import NavBar from "./components/common/NavBar";

// views
import Home from "./views/Home";
import colors from "./assets/styles/colors";
import PharamcyView from "./views/PharmacyView";
import AllPharmacyView from "./views/AllPharmacyView";
import MapGoogle from "./views/MapGoogle";

// redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store";
import MyOrders from "./views/MyOrders";

let persistor = persistStore(store);

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: "#000",
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pharmacies/:pharamcyId" element={<PharamcyView />} />
            <Route path="/pharmacies" element={<AllPharmacyView />} />
            <Route path="/map-google" element={<MapGoogle/>}/>
            <Route path="/my-orders" element={<MyOrders />} />  
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
