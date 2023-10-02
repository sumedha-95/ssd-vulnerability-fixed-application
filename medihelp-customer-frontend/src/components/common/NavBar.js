import React, { useState, useEffect } from "react";
import {
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box } from "@mui/system";
import colors from "../../assets/styles/colors";
import navbarStyles from "../../assets/styles/components/navbar";
import Popup from "../../components/common/Popup";
import { createUser } from "../../service/signIn.service";
import { registerUser } from "../../service/register.service";
import signIn from "../../models/signIn";
import register from "../../models/register";
import { popAlert } from "../../utils/alerts";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/authSlice";

const NavBar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showRegiserPopup, setshowRegiserPopup] = useState(false);

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [inputs, setInputs] = useState(signIn);
  //register
  const [RegInputs, setRegInputs] = useState(register);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [conError, setConError] = useState("");

  const handlePopupClose = () => setShowPopup(false);
  const handleRegisterPopupClose = () => setshowRegiserPopup(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await createUser(inputs);

    if (response.success) {
      setLoading(false);
      dispatch(authActions.login(response.data));
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success").then(
          (res) => {}
        );
      window.location.replace("/");
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await registerUser(RegInputs);

    if (response.success) {
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success").then((res) => {
          setShowPopup(false);
        });
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setRegInputs(register);
  };

  useEffect(() => {
    let unmounted = false;

    if (RegInputs.password !== confirmPassword) {
      if (!unmounted) setConError("Password does not match!");
    } else {
      if (!unmounted) setConError("");
    }
    return () => {
      unmounted = true;
    };
  }, [confirmPassword, RegInputs.password]);

  return (
    <React.Fragment>
      <Box sx={{ backgroundColor: colors.primary, px: 8, py: 3 }}>
        <Grid container>
          <Grid item xs={6}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ height: "100%" }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: colors.white }}
              >
                MediHelp
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              alignItems="center"
              sx={{ height: "100%" }}
            >
              {authState?.isLoggedIn ? (
                <>
                  <Typography
                    sx={{ ...navbarStyles.signInUpBtn }}
                    onClick={() => dispatch(authActions.logout())}
                  >
                    Sign Out
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    sx={{ ...navbarStyles.signInUpBtn }}
                    onClick={() => setshowRegiserPopup(true)}
                  >
                    Register
                  </Typography>
                  <Typography
                    sx={{ ...navbarStyles.signInUpBtn }}
                    onClick={() => setShowPopup(true)}
                  >
                    Sign In
                  </Typography>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* signin popup */}
      <Popup width={650} show={showPopup} onClose={handlePopupClose}>
        <Box sx={{ mb: 2 }}>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              textAlign={"center"}
              sx={{ mb: 6 }}
            >
              Sign In
            </Typography>
            <Box sx={{ mb: 5, m: 2 }}>
              <TextField
                variant="filled"
                label="Email"
                fullWidth
                value={inputs.email}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    email: e.target.value,
                  })
                }
              />
              {errors["email"] && (
                <Typography color="error">{errors["email"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 5, m: 2, mt: 6 }}>
              <TextField
                variant="filled"
                label="Password"
                type="password"
                fullWidth
                value={inputs.password}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    password: e.target.value,
                  })
                }
              />
              {errors["password"] && (
                <Typography color="error">{errors["password"]}</Typography>
              )}
            </Box>

            <Box sx={{ ml: 50 }}>
              <Typography variant="h7" color="primary">
                Forget Your Password ?
              </Typography>
            </Box>
            <Box sx={{ m: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress color="secondary" /> : "Sign In"}
              </Button>
            </Box>
          </form>
          <Box textAlign={"center"}>
            <Typography variant="h7" color="primary">
              Do you need to create an account?
            </Typography>
          </Box>
        </Box>
      </Popup>

      {/* register popup */}

      <Popup
        width={650}
        show={showRegiserPopup}
        onClose={handleRegisterPopupClose}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            textAlign={"center"}
            sx={{ mb: 6 }}
          >
            Register
          </Typography>

          <form onSubmit={handleRegisterSubmit}>
            <Box sx={{ mb: 2, m: 3 }}>
              <TextField
                variant="filled"
                label="First Name"
                fullWidth
                value={RegInputs.firstName}
                onChange={(e) =>
                  setRegInputs({
                    ...RegInputs,
                    firstName: e.target.value,
                  })
                }
              />
              {errors["firstName"] && (
                <Typography color="error">{errors["firstName"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <TextField
                variant="filled"
                label="Last Name"
                fullWidth
                value={RegInputs.lastName}
                onChange={(e) =>
                  setRegInputs({
                    ...RegInputs,
                    lastName: e.target.value,
                  })
                }
              />
              {errors["lastName"] && (
                <Typography color="error">{errors["lastName"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <TextField
                variant="filled"
                label="NIC"
                fullWidth
                value={RegInputs.NIC}
                onChange={(e) =>
                  setRegInputs({
                    ...RegInputs,
                    NIC: e.target.value,
                  })
                }
              />
              {errors["NIC"] && (
                <Typography color="error">{errors["NIC"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <TextField
                id="outlined-basic"
                variant="filled"
                label="Address"
                fullWidth
                value={RegInputs.address}
                onChange={(e) =>
                  setRegInputs({
                    ...RegInputs,
                    address: e.target.value,
                  })
                }
              />
              {errors["address"] && (
                <Typography color="error">{errors["address"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <TextField
                variant="filled"
                label="Mobile"
                fullWidth
                value={RegInputs.mobile}
                onChange={(e) =>
                  setRegInputs({
                    ...RegInputs,
                    mobile: e.target.value,
                  })
                }
              />
              {errors["mobile"] && (
                <Typography color="error">{errors["mobile"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <TextField
                variant="filled"
                label="E-mail"
                type="email"
                fullWidth
                value={RegInputs.email}
                onChange={(e) =>
                  setRegInputs({
                    ...RegInputs,
                    email: e.target.value,
                  })
                }
              />
              {errors["email"] && (
                <Typography color="error">{errors["email"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disableFuture
                  label="Birth Date"
                  fullWidth
                  openTo="year"
                  views={["year", "month", "day"]}
                  value={RegInputs.birthday}
                  onChange={(nValue) =>
                    setRegInputs({
                      ...RegInputs,
                      birthday: nValue,
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              {errors["birthday"] && (
                <Typography color="error">{errors["birthday"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <TextField
                variant="filled"
                label="Password"
                type="password"
                fullWidth
                value={RegInputs.password}
                onChange={(e) =>
                  setRegInputs({
                    ...RegInputs,
                    password: e.target.value,
                  })
                }
              />
              {errors["password"] && (
                <Typography color="error">{errors["password"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, m: 3 }}>
              <TextField
                variant="filled"
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {conError && <Typography color="error">{conError}</Typography>}
            </Box>

            <Box
              sx={{ mb: 2, mr: 3, display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="reset"
                variant="contained"
                onClick={handleClear}
                sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ py: 2, px: 5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress color="secondary" /> : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Popup>
    </React.Fragment>
  );
};

export default NavBar;
