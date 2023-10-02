import React from "react";
import { Stack, Typography } from "@mui/material";
import {
  Dashboard,
  Medication,
  ShoppingBag,
  Payment,
  Vaccines,
  Logout,
  Person,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import colors from "../../assets/styles/colors";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <Box
      position="fixed"
      sx={{
        display: {
          xs: "none",
          sm: "block",
          background: colors.primary,
          color: colors.white,
          height: "100vh",
          width: "20vw",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Stack
            direction="row"
            justifyContent="center"
            textAlign="center"
            sx={{ mt: 5, mb: 4 }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: colors.white }}
            >
              MediHelp
            </Typography>
          </Stack>
          <List>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/dashboard">
                <ListItemIcon sx={{ display: { color: colors.white } }}>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon sx={{ display: { color: colors.white } }}>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/pharmacy">
                <ListItemIcon sx={{ display: { color: colors.white } }}>
                  <Medication />
                </ListItemIcon>
                <ListItemText primary="Pharmacies" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/orders">
                <ListItemIcon sx={{ display: { color: colors.white } }}>
                  <ShoppingBag />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/global-medicines">
                <ListItemIcon sx={{ display: { color: colors.white } }}>
                  <Vaccines />
                </ListItemIcon>
                <ListItemText primary="Global Medicines" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon sx={{ display: { color: colors.white } }}>
                  <Payment />
                </ListItemIcon>
                <ListItemText primary="Payments" />
              </ListItemButton>
            </ListItem>
            {/* <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemIcon sx={{ display: { color: colors.white } }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem> */}
          </List>
        </Box>
        <Box sx={{ bottom: 0 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="#simple-list"
                onClick={handleLogout}
              >
                <ListItemIcon sx={{ display: { color: colors.white } }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
