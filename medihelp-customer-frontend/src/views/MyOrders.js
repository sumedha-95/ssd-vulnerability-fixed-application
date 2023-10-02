import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Pagination,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  confirmOrder,
  getAllOrders,
  rejectOrder,
  removeOrder,
} from "../service/order.service";
import Popup from "../components/common/Popup";
import { popAlert } from "../utils/alerts";
import Medicine from "../components/myOrders/Medicine";
import ProfileSidebar from "../components/common/ProfileSideBar";
import OrderCard from "../components/myOrders/OrderCard";
import { useSearchParams } from "react-router-dom";
import { createCheckoutSession } from "../service/payment.service";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const boxStyles = {
  borderRadius: 5,
  boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
  p: 3,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyOrders = () => {
  const authState = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const processStatus = (status) => {
    if (status === "pending") return "Pending";
    else if (status === "requires_customer_confimation")
      return "Requires Confirmation";
    else if (status === "confirmed") return "Confirmed";
    else if (status === "cancelled") return "Cancelled";
    else if (status === "completed") return "Completed";
  };

  const handleOrderConfirm = async (orderId) => {
    if (!paymentMethod) {
      popAlert("Error!", "Please select payment method first!", "error");
    } else if (paymentMethod === "online") {
      setIsSaving(true);
      const response = await createCheckoutSession(orderId);
      setIsSaving(false);
      if (response.success) {
        if (response?.data?.url) window.location.replace(response.data.url);
      } else {
        response?.data?.message &&
          popAlert("Error!", response?.data?.message, "error");
      }
    } else if (paymentMethod === "cash_on_delivery") {
      setIsSaving(true);
      const response2 = await confirmOrder(orderId);
      setIsSaving(false);
      if (response2.success) {
        response2?.data?.message &&
          popAlert("Success!", response2?.data?.message, "success");
        setStatus("confirmed");
        setTabValue(2);
        setPage(1);
      } else {
        response2?.data?.message &&
          popAlert("Error!", response2?.data?.message, "error");
      }
    }
  };

  const handleOrderCancel = async (orderId) => {
    setIsSaving(true);
    const response = await rejectOrder(orderId);
    setIsSaving(false);
    if (response.success) {
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success");
      setStatus("cancelled");
      setTabValue(4);
      setPage(1);
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
    }
  };

  const handleOrderRemove = async (orderId) => {
    setIsSaving(true);
    const response = await removeOrder(orderId);
    setIsSaving(false);
    if (response.success) {
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success");
      setStatus("cancelled");
      setTabValue(4);
      setPage(1);
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
    if (newValue === 0) {
      setStatus("pending");
    } else if (newValue === 1) {
      setStatus("requires_customer_confimation");
    } else if (newValue === 2) {
      setStatus("confirmed");
    } else if (newValue === 3) {
      setStatus("completed");
    } else if (newValue === 4) {
      setStatus("cancelled");
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOrderCardBtnClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const selectedOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderId),
    [selectedOrderId, orders]
  );

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) setLoading(true);
    const fetchAndSet = async () => {
      const response = await getAllOrders(page, 10, "desc", status);

      if (response.success) {
        if (!unmounted) {
          setOrders(response?.data?.content || []);
          setTotalPages(response?.data?.totalPages || 0);
        }
      }

      if (!unmounted) setLoading(false);
    };

    fetchAndSet();

    return () => {
      unmounted = true;
    };
  }, [authState, page, status]);

  // handle payment redirect
  useEffect(() => {
    let unmounted = false;

    // handle success
    if (searchParams.get("success") === "true") {
      popAlert("Success!", "Payment has been successful completed!", "success");
      if (!unmounted) {
        if (searchParams.get("orderID"))
          setSelectedOrderId(searchParams.get("orderID"));
        setStatus("confirmed");
        setTabValue(2);
        setPage(1);
      }
    }

    // handle cancellation
    if (searchParams.get("canceled") === "true") {
      popAlert("Error!", "Payment has been failed!", "error");
      if (!unmounted) {
        if (searchParams.get("orderID"))
          setSelectedOrderId(searchParams.get("orderID"));
        setStatus("requires_customer_confimation");
        setTabValue(1);
        setPage(1);
      }
    }

    setSearchParams({});

    return () => {
      unmounted = true;
    };
  }, [searchParams, setSearchParams]);

  return (
    <React.Fragment>
      <Grid container>
        <Grid item md={3} display={"flex"} justifyContent={"center"}>
          <ProfileSidebar active={"my-orders"} />
        </Grid>
        <Grid item md={9} sx={{ pr: 5, py: 2 }}>
          <Box>
            <Box sx={{ my: 3 }}>
              <Typography variant="h4" fontWeight={"bold"}>
                All Orders
              </Typography>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="basic tabs example"
              >
                <Tab label="Pending" {...a11yProps(0)} />
                <Tab label="To Be Confirmed" {...a11yProps(1)} />
                <Tab label="Confirmed" {...a11yProps(2)} />
                <Tab label="Completed" {...a11yProps(3)} />
                <Tab label="Rejected" {...a11yProps(4)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={tabValue}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                  &nbsp;&nbsp; Please Wait Until We Load Your Orders..
                </Box>
              ) : orders?.length > 0 ? (
                orders.map((order) => {
                  return (
                    <OrderCard
                      key={order?._id}
                      id={order?._id}
                      pharmacy={order?.pharmacy?.name}
                      price={order?.payment?.total}
                      onButtonClick={handleOrderCardBtnClick}
                    />
                  );
                })
              ) : (
                <Typography variant="h5" fontWeight={"bold"}>
                  Oops! Nothing in the list.
                </Typography>
              )}
            </TabPanel>
          </Box>
          <Box display={"flex"} justifyContent="flex-end">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              fontWeight={"bold"}
            />
          </Box>
        </Grid>
      </Grid>
      <Popup
        title={selectedOrder?._id}
        width={1200}
        show={showPopup}
        onClose={handlePopupClose}
      >
        <Grid container sx={{ py: 3 }} spacing={2}>
          <Grid item md={6}>
            <Box
              sx={{
                ...boxStyles,
              }}
            >
              <Typography variant="h6" fontWeight={"bold"} sx={{ pb: 1 }}>
                Medicines
              </Typography>
              {selectedOrder?.medicines.length > 0 ? (
                selectedOrder?.medicines?.map((medicine, key) => {
                  return (
                    <Box key={key}>
                      <Medicine
                        medicine={medicine}
                        onClose={handlePopupClose}
                      />
                      <Divider />
                    </Box>
                  );
                })
              ) : (
                <Typography variant="h7" fontWeight={"bold"}>
                  Oops! Nothing in the list.
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    ...boxStyles,
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box display="flex" width={"100%"}>
                        <Box
                          display="flex"
                          justifyContent={"flex-start"}
                          width={"100%"}
                        >
                          <Typography variant="p" fontWeight={"bold"}>
                            Status:
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent={"flex-end"}
                          width={"100%"}
                        >
                          <Typography
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {(selectedOrder?.status &&
                              processStatus(selectedOrder.status)) ||
                              "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    ...boxStyles,
                  }}
                >
                  <Typography variant="h6" fontWeight={"bold"} sx={{ pb: 1 }}>
                    Delivery
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box display="flex" width={"100%"}>
                        <Box
                          display="flex"
                          justifyContent={"flex-start"}
                          width={"100%"}
                        >
                          <Typography variant="p" fontWeight={"bold"}>
                            Receiver's Name:
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent={"flex-end"}
                          width={"100%"}
                        >
                          <Typography
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {selectedOrder?.patient?.name || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" width={"100%"}>
                        <Box
                          display="flex"
                          justifyContent={"flex-start"}
                          width={"100%"}
                        >
                          <Typography variant="p" fontWeight={"bold"}>
                            Receiver's NIC:
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent={"flex-end"}
                          width={"100%"}
                        >
                          <Typography
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {selectedOrder?.patient?.NIC || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" width={"100%"}>
                        <Box
                          display="flex"
                          justifyContent={"flex-start"}
                          width={"100%"}
                        >
                          <Typography variant="p" fontWeight={"bold"}>
                            Receiver's Address:
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent={"flex-end"}
                          width={"100%"}
                        >
                          <Typography
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {selectedOrder?.delivery?.address || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    ...boxStyles,
                  }}
                >
                  <Typography variant="h6" fontWeight={"bold"} sx={{ pb: 1 }}>
                    Payment
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box display="flex" width={"100%"}>
                        <Box
                          display="flex"
                          justifyContent={"flex-start"}
                          width={"100%"}
                        >
                          <Typography variant="p" fontWeight={"bold"}>
                            Status:
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent={"flex-end"}
                          width={"100%"}
                        >
                          <Typography
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {selectedOrder?.payment?.status
                              ? "Complete"
                              : "Pending"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" width={"100%"}>
                        <Box
                          display="flex"
                          justifyContent={"flex-start"}
                          width={"100%"}
                        >
                          <Typography variant="p" fontWeight={"bold"}>
                            Sub Total:
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent={"flex-end"}
                          width={"100%"}
                        >
                          <Typography
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {(selectedOrder?.payment?.subtotal &&
                              `Rs.${selectedOrder.payment.subtotal.toLocaleString(
                                "en-us"
                              )}`) ||
                              "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" width={"100%"}>
                        <Box
                          display="flex"
                          justifyContent={"flex-start"}
                          width={"100%"}
                        >
                          <Typography variant="p" fontWeight={"bold"}>
                            Delivery Charges:
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent={"flex-end"}
                          width={"100%"}
                        >
                          <Typography
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {(selectedOrder?.payment?.subtotal &&
                              `Rs.${selectedOrder.payment.delivery.toLocaleString(
                                "en-us"
                              )}`) ||
                              "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
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
                        <Box
                          display="flex"
                          justifyContent={"flex-end"}
                          width={"100%"}
                        >
                          <Typography
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {(selectedOrder?.payment?.subtotal &&
                              `Rs.${selectedOrder.payment.total.toLocaleString(
                                "en-us"
                              )}`) ||
                              "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {(status === "requires_customer_confimation" ||
                status === "pending" ||
                status === "cancelled" ||
                status === "completed") && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      ...boxStyles,
                    }}
                  >
                    <Typography variant="h6" fontWeight={"bold"} sx={{ pb: 1 }}>
                      Order Actions
                    </Typography>
                    <Grid container spacing={1}>
                      {status === "requires_customer_confimation" && (
                        <Grid item xs={12}>
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Payment Method
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              value={paymentMethod}
                              onChange={handlePaymentMethodChange}
                            >
                              <FormControlLabel
                                value="online"
                                control={<Radio />}
                                label="Online"
                              />
                              <FormControlLabel
                                value="cash_on_delivery"
                                control={<Radio />}
                                label="Cash On Delivery"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent={"flex-end"}>
                          {(status === "requires_customer_confimation" ||
                            status === "pending") && (
                            <Button
                              variant="contained"
                              onClick={() =>
                                handleOrderCancel(selectedOrder._id)
                              }
                              sx={{
                                borderRadius: "8px",
                                mr: 1,
                              }}
                              color="error"
                              disabled={isSaving}
                            >
                              Cancel
                              {isSaving && (
                                <>
                                  &nbsp;&nbsp;
                                  <CircularProgress size={"20px"} />
                                </>
                              )}
                            </Button>
                          )}
                          {status === "requires_customer_confimation" && (
                            <Button
                              variant="contained"
                              onClick={() =>
                                handleOrderConfirm(selectedOrder._id)
                              }
                              sx={{
                                borderRadius: "8px",
                              }}
                              disabled={isSaving}
                            >
                              Confirm
                              {isSaving && (
                                <>
                                  &nbsp;&nbsp;
                                  <CircularProgress size={"20px"} />
                                </>
                              )}
                            </Button>
                          )}
                          {(status === "cancelled" ||
                            status === "completed") && (
                            <Button
                              color="error"
                              variant="contained"
                              onClick={() =>
                                handleOrderRemove(selectedOrder._id)
                              }
                              sx={{
                                borderRadius: "8px",
                              }}
                              disabled={isSaving}
                            >
                              Remove
                              {isSaving && (
                                <>
                                  &nbsp;&nbsp;
                                  <CircularProgress size={"20px"} />
                                </>
                              )}
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Popup>
    </React.Fragment>
  );
};

export default MyOrders;
