import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Grid,
  Autocomplete,
  TextField,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import { getGlobalMedicines } from "../../service/globalMedicines.service";
import { Box } from "@mui/system";
import ReusableTable from "../common/ReusableTable";
import TableAction from "../common/TableActions";
import { popAlert } from "../../utils/alerts";
import { getMedinceByGID } from "../../service/medicine.service";
import colors from "../../assets/styles/colors";
import { approveOrder } from "../../service/order.service";

const tableColumns = [
  {
    id: "id",
    label: "ID",
  },
  {
    id: "name",
    label: "Name",
    align: "right",
  },
  {
    id: "quantity",
    label: "Quantity",
    align: "right",
  },
  {
    id: "availability",
    label: "Availability",
    align: "right",
    format: (value) => (value ? "Yes" : "No"),
  },
  {
    id: "action",
    label: "Action",
    align: "right",
  },
];

let inputModel = {
  medicine: { id: "", name: "" },
  quantity: 0,
};

const UnApprovedOrder = ({ order, onDataUpdate }) => {
  const timeoutRef = useRef(null);
  const tRowRef = useRef([]);

  const [isSelectDataLoading, setIsSelectDataLoading] = useState(false);
  const [globalMedicines, setGlobalMedicines] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [inputs, setInputs] = useState(inputModel);
  const [open, setOpen] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleApproval = async () => {
    setLoading(true);
    const preparedArr = [];

    for (const row of tableRows) {
      preparedArr.push({
        globalMedicine: {
          _id: row.id,
        },
        quantity: parseInt(row.quantity),
        name: row.name,
        availability: row.availability,
      });
    }

    // api call
    const response = await approveOrder(order._id, { medicines: preparedArr });

    if (response.success) {
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success").then((res) => {
          onDataUpdate();
        });
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
    }

    setLoading(false);
  };

  const handleClear = () => {
    setTableRows([]);
    tRowRef.current = [];
  };

  const handleDelete = (id) => {
    const filteredRes = tRowRef.current.filter((medi) => medi.id !== id);
    tRowRef.current = filteredRes;
    setTableRows(filteredRes);
  };

  const handleClick = async () => {
    let availability = true;

    if (!inputs.medicine.id)
      return popAlert("Error!", "Please select the medicine first!", "error");

    if (!inputs.quantity)
      return popAlert("Error!", "Please select the quantity first!", "error");

    setLoading(true);

    // validate stock level
    const response = await getMedinceByGID(
      inputs.medicine.id,
      order.pharmacy._id
    );

    if (response.success) {
      const rMedicine = response.data;
      if (rMedicine.stockLevel < inputs.quantity) {
        availability = false;
      }
    } else {
      if (response?.data?.message) {
        // refactor this later using a proper backend api
        if (response.data.message === "Medicine not found!") {
          availability = false;
        } else {
          popAlert("Error!", response.data.message, "error");
        }
      }
    }

    const isExists = tRowRef.current.find(
      (medi) => medi.id === inputs.medicine.id
    );
    if (isExists) {
      setLoading(false);
      return popAlert(
        "Error!",
        "You cannot add the same medicine twice!",
        "error"
      );
    }

    const tr = [
      {
        id: inputs.medicine.id,
        name: inputs.medicine.name,
        quantity: inputs.quantity,
        availability: availability,
        action: <TableAction id={inputs.medicine.id} onDelete={handleDelete} />,
      },
    ].concat(tableRows);

    setTableRows(tr);
    tRowRef.current = tr;
    setInputs(inputModel);
    setLoading(false);
  };

  const memoizedLabel = useMemo(
    () =>
      globalMedicines.find((medi) => medi.id === inputs.medicine.id)?.label ||
      "",
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputs.medicine.id]
  );

  const throttle = (func, time) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(func, time);
  };

  //select medicine
  useEffect(() => {
    let unmounted = false;

    if (!unmounted && open) setIsSelectDataLoading(true);

    const fetchAndSet = async () => {
      const response = await getGlobalMedicines(1, 20, "desc", keyword);

      if (response.success) {
        if (!response.data) return;

        let gMedicineArr = [];

        for (const gMedicine of response.data.content) {
          gMedicineArr.push({ label: gMedicine.name, id: gMedicine._id });
        }

        if (!unmounted) {
          setGlobalMedicines(gMedicineArr);
        }
      } else {
        console.error(response?.data);
      }
      if (!unmounted) setIsSelectDataLoading(false);
    };

    if (open) throttle(() => fetchAndSet(), 500);

    return () => {
      unmounted = true;
    };
  }, [keyword, open]);

  useEffect(() => {
    let unmounted = false;

    if (!open && !unmounted) {
      setGlobalMedicines([]);
    }

    return () => {
      unmounted = true;
    };
  }, [open]);

  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} lg={5}>
          <img
            style={{ width: "100%", objectFit: "contain", borderRadius: 8 }}
            src={order?.prescriptionSheet}
            alt="prescription sheet"
          />
        </Grid>
        <Grid item xs={12} lg={7}>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight={"bold"}>
                Record Medicines
              </Typography>
              <Typography>
                Enter the medicine name and select the most relavent medicine
                from the results and click on the add button.
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Box>
                <Autocomplete
                  id="combo-box-demo"
                  fullWidth
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  value={memoizedLabel}
                  onChange={(event, value) => {
                    if (value?.id) {
                      setInputs({
                        ...inputs,
                        medicine: { name: value.label, id: value.id },
                      });
                    } else {
                      setInputs({
                        ...inputs,
                        medicine: { name: "", id: "" },
                      });
                    }
                  }}
                  options={globalMedicines}
                  loading={isSelectDataLoading}
                  onInputChange={(event, inputValue) => {
                    setKeyword(inputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Medicine"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isSelectDataLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <TextField
                  name="quantity"
                  variant="outlined"
                  label="Quantity"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                  value={inputs.quantity}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      quantity: e.target.value,
                    })
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ py: 2, px: 5 }}
                  onClick={handleClick}
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress color="secondary" /> : "Add"}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {tableRows && tableRows.length > 0 && (
                <ReusableTable rows={tableRows} columns={tableColumns} />
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            {tableRows && tableRows.length > 0 && (
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
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
                  onClick={handleApproval}
                >
                  {loading ? <CircularProgress color="secondary" /> : "Approve"}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default UnApprovedOrder;
