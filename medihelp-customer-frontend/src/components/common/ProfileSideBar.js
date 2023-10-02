import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const ProfileSidebar = ({ active }) => {
  return (
    <React.Fragment>
      <Box display={"flex"} flexDirection={"column"} sx={{ m: 5 }}>
        <Box display={"flex"} flexDirection={"column"} alignItems="center">
          <img
            src="https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_960_720.png"
            alt=""
            style={{
              height: 200,
              width: 200,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" textAlign={"center"} fontWeight={"bold"}>
              Benuka Punchihewa
            </Typography>
          </Box>
        </Box>
        <br />
        <Divider />
        <br />
        <Box sx={{ m: 1 }}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/profile-settings"
          >
            {active === "profile-settings" ? (
              <Typography fontWeight={"bold"}>Profile Settings</Typography>
            ) : (
              <Typography>Profile Settings</Typography>
            )}
          </Link>
        </Box>
        <Box sx={{ m: 1 }}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/my-orders"
          >
            {active === "my-orders" ? (
              <Typography fontWeight={"bold"}>My Orders</Typography>
            ) : (
              <Typography>My Orders</Typography>
            )}
          </Link>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default ProfileSidebar;
