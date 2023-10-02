import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";

const OrderCard = ({ id, pharmacy, price, onButtonClick }) => {
  return (
    <React.Fragment>
      <Box
        sx={{
          borderRadius: "8px",
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
          padding: "20px 30px",
          mb: 2,
        }}
      >
        <Grid container>
          <Grid item md={10}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="p" fontWeight={"bold"}>
                  Order ID:
                </Typography>
                &nbsp; &nbsp;
                <Typography variant="p">
                  {(id && `#${id}`) || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="p" fontWeight={"bold"}>
                  Pharmacy:
                </Typography>
                &nbsp; &nbsp;
                <Typography variant="p">{pharmacy || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="p" fontWeight={"bold"}>
                  Price:
                </Typography>
                &nbsp; &nbsp;
                <Typography variant="p">
                  {(price && `Rs.${price.toLocaleString("en-us")}`) || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            md={2}
            display="flex"
            flexDirection="column"
            justifyContent={"flex-end"}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={() => onButtonClick(id)}
              sx={{
                borderRadius: "8px",
              }}
            >
              View
            </Button>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default OrderCard;
