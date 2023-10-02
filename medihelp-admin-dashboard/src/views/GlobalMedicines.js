import React, { useState, useEffect } from "react";
import SearchBar from "../components/common/SearchBar";
import AddButton from "../components/common/AddButton";
// import ReportButton from "../components/common/ReportButton";
import {
  Grid,
  Box,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

import Popup from "../components/common/Popup";
import globalMedicine from "../models/globalMedicine";
import {
  createGlobalMedicine,
  getGlobalMedicines,
} from "../service/globalMedicines.service";
import { popAlert } from "../utils/alerts";
import colors from "../assets/styles/colors";
import ReusableTable from "../components/common/ReusableTable";
import TableAction from "../components/common/TableActions";

//table columns
const tableColumns = [
  {
    id: "name",
    label: "Name",
    minWidth: 140,
    align: "left",
  },
  {
    id: "brand",
    label: "Brand",
    align: "right",
  },
  {
    id: "strength",
    label: "Strength (mg)",
    align: "right",
  },
  {
    id: "action",
    label: "Action",
    align: "right",
  },
];

const GlobalMedicens = () => {
  const [inputs, setInputs] = useState(globalMedicine);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    orderBy: "desc",
  });
  const [tableRows, setTableRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await createGlobalMedicine(inputs);

    if (response.success) {
      setRefresh(!refresh);
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
    setInputs(globalMedicine);
  };

  const handleEdit = (id) => {
    console.log(id);
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page: page });
  };

  const handleLimitChange = (limit) => {
    setPagination({ ...pagination, limit: limit });
  };

  const handleSearch = (input) => {
    setKeyword(input);
  };

  const handlePopupClose = () => setShowPopup(false);

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setIsLoading(true);

    const fetchAndSet = async () => {
      const response = await getGlobalMedicines(
        pagination.page,
        pagination.limit,
        pagination.orderBy,
        keyword
      );

      if (response.success) {
        if (!response.data) return;

        let tableDataArr = [];
        for (const globalMedicine of response.data.content) {
          tableDataArr.push({
            name: globalMedicine.name,
            brand: globalMedicine.brand,
            strength: globalMedicine.strength,
            action: (
              <TableAction
                id={globalMedicine._id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ),
          });
        }

        if (!unmounted) {
          setTotalElements(response.data.totalElements);
          setTableRows(tableDataArr);
        }
      } else {
        console.error(response?.data);
      }
      if (!unmounted) setIsLoading(false);
    };

    fetchAndSet();

    return () => {
      unmounted = true;
    };
  }, [pagination, refresh, keyword]);

  return (
    <React.Fragment>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Global Medicines
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <SearchBar
            onSearch={handleSearch}
            placeholderText="Search Global Medicines..."
          />
        </Grid>
        <Grid item xs={1}>
          <AddButton onClick={() => setShowPopup(true)} />
        </Grid>
        <Grid item xs={1}>
          {/* <ReportButton /> */}
        </Grid>
      </Grid>

      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            mt: "3%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ mr: 2 }} />
          Loading...
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            mt: "3%",
          }}
        >
          <ReusableTable
            rows={tableRows}
            columns={tableColumns}
            totalElements={totalElements}
            limit={pagination.limit}
            page={pagination.page}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </Box>
      )}

      {/* custom popup */}
      <Popup
        title="Add Medicine"
        width={800}
        show={showPopup}
        onClose={handlePopupClose}
      >
        <Box sx={{ mb: 2 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="name"
                variant="filled"
                label="Name"
                fullWidth
                value={inputs.name}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    name: e.target.value,
                  })
                }
              />
              {errors["name"] && (
                <Typography color="error">{errors["name"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="strength"
                variant="filled"
                label="Strength (mg)"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                value={inputs.strength}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    strength: e.target.value,
                  })
                }
              />
              {errors["strength"] && (
                <Typography color="error">{errors["strength"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="brand"
                variant="filled"
                label="Brand"
                fullWidth
                value={inputs.brand}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    brand: e.target.value,
                  })
                }
              />
              {errors["brand"] && (
                <Typography color="error">{errors["brand"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="manufacturer"
                variant="filled"
                label="Manufacturer"
                fullWidth
                value={inputs.manufacturer}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    manufacturer: e.target.value,
                  })
                }
              />
              {errors["manufacturer"] && (
                <Typography color="error">{errors["manufacturer"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                name="type"
                variant="filled"
                label="Type"
                helperText="Please select prescription type."
                fullWidth
                value={inputs.type}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    type: e.target.value,
                  })
                }
              >
                <MenuItem value="prescription">Prescription</MenuItem>
                <MenuItem value="non-prescription">Non-Prescription</MenuItem>
              </TextField>
              {errors["type"] && (
                <Typography color="error">{errors["type"]}</Typography>
              )}
            </Box>
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

export default GlobalMedicens;
