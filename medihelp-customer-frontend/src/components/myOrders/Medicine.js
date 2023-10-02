import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Medicine = ({ medicine, onClose }) => {
  const navigate = useNavigate();

  const handlePharmacyRedirect = () => {
    navigate(`/pharmacies/${medicine?.suggession?._id}`);
  };

  return (
    <React.Fragment>
      <Box sx={{ py: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ px: 1 }}>
            <Box display="flex" width={"100%"}>
              <Box display="flex" justifyContent={"flex-start"} width={"100%"}>
                <Typography variant="p" fontWeight={"bold"}>
                  Name:
                </Typography>
              </Box>
              <Box display="flex" justifyContent={"flex-end"} width={"100%"}>
                <Typography textOverflow={"ellipsis"} whiteSpace={"nowrap"}>
                  {medicine?.globalMedicine?.name || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ px: 1 }}>
            <Box display="flex" width={"100%"}>
              <Box display="flex" justifyContent={"flex-start"} width={"100%"}>
                <Typography variant="p" fontWeight={"bold"}>
                  Available:
                </Typography>
              </Box>
              <Box display="flex" justifyContent={"flex-end"} width={"100%"}>
                <Typography variant="p">
                  {medicine?.availability ? "Yes" : "No"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ px: 1 }}>
            <Box display="flex" width={"100%"}>
              <Box display="flex" justifyContent={"flex-start"} width={"100%"}>
                <Typography variant="p" fontWeight={"bold"}>
                  Quantity:
                </Typography>
              </Box>
              <Box display="flex" justifyContent={"flex-end"} width={"100%"}>
                <Typography variant="p">
                  {(medicine?.quantity &&
                    `${medicine.quantity.toLocaleString("en-us")}`) ||
                    "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          {medicine?.availability ? (
            <Grid item xs={12} sx={{ px: 1 }}>
              <Box display="flex" width={"100%"}>
                <Box
                  display="flex"
                  justifyContent={"flex-start"}
                  width={"100%"}
                >
                  <Typography variant="p" fontWeight={"bold"}>
                    Total:
                  </Typography>
                </Box>
                <Box display="flex" justifyContent={"flex-end"} width={"100%"}>
                  <Typography variant="p">
                    {(medicine?.subTotal &&
                      `Rs.${(medicine?.subTotal).toLocaleString("en-us")}`) ||
                      "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              sx={{
                mt: 1,
                py: 2,
                px: 1,
                borderRadius: "5px",
                background: "#eed202",
              }}
            >
              {medicine?.suggession ? (
                <Typography fontWeight={"bold"}>
                  Available At {medicine?.suggession?.name}{" "}
                  {(medicine?.suggession?.crowDistance &&
                    `${medicine.suggession.crowDistance.toLocaleString(
                      "en-us"
                    )}km Away From Your Delivery Location.`) ||
                    "N/A"}{" "}
                  <u
                    style={{ cursor: "pointer" }}
                    onClick={handlePharmacyRedirect}
                  >
                    Click Here
                  </u>{" "}
                  To View.
                </Typography>
              ) : (
                <Typography fontWeight={"bold"}>
                  It Seems That Medicine Has Not Been Found Anywhere!
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default Medicine;
