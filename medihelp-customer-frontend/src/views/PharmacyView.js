import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import colors from "../assets/styles/colors";
import commonStyles from "../assets/styles/common";
import orderModel from "../models/order";
import { createOrder } from "../service/order.service";
import { popAlert } from "../utils/alerts";

const PharamcyView = () => {
  const [inputs, setInputs] = useState(orderModel);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // prepare form data
    const formData = new FormData();
    formData.append("image", inputs.prescriptionSheet);
    formData.append("stringifiedBody", JSON.stringify(inputs));

    const response = await createOrder(formData);

    if (response.success) {
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "error");
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          ...commonStyles.bodyContainer,
        }}
      >
        <Box
          sx={{
            borderRadius: 6,
            backgroundColor: colors.secondary,
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            p: 5,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Selected Pharmacy
          </Typography>
          <Stack flexDirection="row" sx={{ mt: 3 }} alignItems="center">
            <img
              src="https://img.freepik.com/free-photo/young-woman-pharmacist-pharmacy_1303-25541.jpg?w=2000"
              alt=""
              style={{
                width: 150,
                height: 150,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <Grid container sx={{ ml: 5 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ marginBottom: "10px" }}>
                  <Typography variant="p" sx={{ fontWeight: "bold" }}>
                    Name:
                  </Typography>
                  &nbsp;Samarashingha Pharamacy
                </Box>
                <Box sx={{ marginBottom: "10px" }}>
                  <Typography variant="p" sx={{ fontWeight: "bold" }}>
                    Registration Number:
                  </Typography>
                  &nbsp; RG-GMP-001
                </Box>
                <Box sx={{ marginBottom: "5px" }}>
                  <Typography variant="p" sx={{ fontWeight: "bold" }}>
                    Distance:
                  </Typography>
                  &nbsp; 12km
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ marginBottom: "5px" }}>
                  <Typography variant="p" sx={{ fontWeight: "bold" }}>
                    Address:
                  </Typography>
                  &nbsp; 42/1A, Apple Rd., Pineapple
                </Box>
                <Box sx={{ marginBottom: "3px" }}>
                  <Typography variant="p" sx={{ fontWeight: "bold" }}>
                    Contact:
                  </Typography>
                  &nbsp; 0712704856
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Box>
        <Box
          sx={{
            borderRadius: 6,
            backgroundColor: colors.white,
            mt: 4,
            p: 5,
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Place An Order
          </Typography>
          <Box sx={{ mt: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  name="name"
                  label="Name"
                  variant="filled"
                  fullWidth
                  value={inputs.patient.name}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      patient: { ...inputs.patient, name: e.target.value },
                    })
                  }
                />
                {errors["patient.name"] && (
                  <Typography color="error">
                    {errors["patient.name"]}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  name="NIC"
                  label="NIC"
                  variant="filled"
                  fullWidth
                  value={inputs.patient.NIC}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      patient: { ...inputs.patient, NIC: e.target.value },
                    })
                  }
                />
                {errors["patient.NIC"] && (
                  <Typography color="error">{errors["patient.NIC"]}</Typography>
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  name="name"
                  label="Address"
                  variant="filled"
                  fullWidth
                  value={inputs.delivery.address}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      delivery: { ...inputs.delivery, address: e.target.value },
                    })
                  }
                />
                {errors["delivery.address"] && (
                  <Typography color="error">
                    {errors["delivery.address"]}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  name="name"
                  label="Email"
                  variant="filled"
                  fullWidth
                  value={inputs.patient.email}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      patient: { ...inputs.patient, email: e.target.value },
                    })
                  }
                />
                {errors["patient.email"] && (
                  <Typography color="error">
                    {errors["patient.email"]}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  name="name"
                  label="Mobile"
                  variant="filled"
                  fullWidth
                  value={inputs.patient.contactNumber}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      patient: {
                        ...inputs.patient,
                        contactNumber: e.target.value,
                      },
                    })
                  }
                />
                {errors["patient.contactNumber"] && (
                  <Typography color="error">
                    {errors["patient.contactNumber"]}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography> Prescription Sheet</Typography>

                <Typography
                  variant="p"
                  sx={{ fontSize: "0.8rem", color: colors.grey }}
                >
                  Please upload a clear image of the prescription sheet{" "}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <input
                    type="file"
                    name=""
                    id=""
                    accept="image/png, image/gif, image/jpeg"
                    onChange={(e) => {
                      setImage(window.URL.createObjectURL(e.target.files[0]));
                      setInputs({
                        ...inputs,
                        prescriptionSheet: e.target.files[0],
                      });
                    }}
                  />
                  <Box sx={{ mt: 1 }}>
                    {image && (
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    )}
                    {errors["prescriptionSheet"] && (
                      <Typography color="error">
                        {errors["prescriptionSheet"]}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ py: 2, px: 5 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress color="secondary" /> : "Order"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PharamcyView;
