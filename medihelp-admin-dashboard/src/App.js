import React, { useEffect } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//common
import Sidebar from "./components/common/SideBar";
import NavBar from "./components/common/NavBar";

//view
import Dashboard from "./views/Dashboard";
import Pharmacy from "./views/Pharmacy";
import GlobalMedicines from "./views/GlobalMedicines";
import Orders from "./views/Orders";
import PharmacyProfile from "./views/PharmacyProfile";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import { useSelector } from "react-redux";
import PageNotFound from "./views/PageNotFound";
// import MapGoogal from "./views/MapGoogal";

const App = () => {
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!window.location.href.includes("auth") && !authState?.isLoggedIn)
      window.location.replace("/auth/sign-in");
  }, [authState.isLoggedIn]);

  if (!window.location.href.includes("auth") && authState?.isLoggedIn) {
    return (
      <React.Fragment>
        <Stack flexDirection="row">
          <Box sx={{ width: "20vw" }}>
            <Sidebar />
          </Box>
          <Box sx={{ width: "80vw", padding: 3 }}>
            <Grid container>
              <Grid item xs={12}>
                <NavBar />
              </Grid>
              <Grid item xs={12} sx={{ pt: 3 }}>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/pharmacy" element={<Pharmacy />} />
                    <Route
                      path="/global-medicines"
                      element={<GlobalMedicines />}
                    />
                    <Route path="/pharmacy/:id" element={<PharmacyProfile />} />
                    <Route path="/orders" element={<Orders />} />
                    {/* <Route path="gap-googal" element={<MapGoogal />}/> */}
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </BrowserRouter>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </React.Fragment>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    );
  }
};

export default App;
