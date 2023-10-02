import React, { useState, useEffect, useRef, useMemo, createRef } from "react";
import {
    Typography,
    Box,
    Stack,
    Grid,
    Autocomplete,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import colors from "../assets/styles/colors";
import SearchBar from "../components/common/SearchBar";
import AddButton from "../components/common/AddButton";
import ReusableTable from "../components/common/ReusableTable";
import TableAction from "../components/common/TableActions";
import { useParams } from "react-router-dom";
import { getGlobalMedicines } from "../service/globalMedicines.service";
import { createMedicine, getAllMedicines } from "../service/medicine.service";
import { popAlert, popDangerPrompt } from "../utils/alerts";
import medicine from "../models/medicine";
import Popup from "../components/common/Popup";
import DeleteButton from "../components/common/DeleteButton";
import EditButton from "../components/common/EditButton";
// import Paper from '@mui/material/Paper';
// import MapGoogal from "./MapGoogal";
// import DeleteIcon from '@mui/icons-material/Delete';
import { deletePharmacy, getPharmacyById } from "../service/pharmacy.service";
import { updatePharmacy } from "../service/pharmacy.service";

const tableColumns = [
    {
        id: "name",
        label: "Name",
        minWidth: 140,
        align: "left",
    },
    {
        id: "strength",
        label: "Strength",
        align: "right",
    },
    {
        id: "stockLevel",
        label: "Stock Level",
        align: "right",
    },

    {
        id: "unitPrice",
        label: "Unit Price",
        align: "right",
    },
    {
        id: "action",
        label: "Action",

        align: "right",
    },
];

const PharmacyProfile = () => {
    const { id } = useParams();
    const titleRef = useRef(null);
    const timeoutRef = useRef(null);

    const [inputs, setInputs] = useState(medicine);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectDataLoading, setIsSelectDataLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [editShowPopup, seteditShowPopup] = useState(false);
    const [pharmacydata, setPharmacydata] = useState("");
    const [input, setInput] = useState({});
    const handlePopupClose = () => setShowPopup(false);
    const edithandlePopupClose = () => seteditShowPopup(false);

    // select medicine
    const [globalMedicines, setGlobalMedicines] = useState([]);
    const [open, setOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        orderBy: "desc",
    });
    const [keyword, setKeyword] = useState("");
    const [tableRows, setTableRows] = useState([]);
    const [totalElements, setTotalElements] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await createMedicine(id, inputs);

        if (response.success) {
            setRefresh(!refresh);
            response?.data?.message &&
                popAlert("Success!", response?.data?.message, "success").then((res) => {
                    setShowPopup(false);
                    seteditShowPopup(false);
                });
        } else {
            response?.data?.message && popAlert("Error!", response?.data?.message, "error");
            response?.data?.data && setErrors(response.data.data);
        }
        setIsLoading(false);
    };

    //update pharmacy
    const updatePharmacyhandleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await updatePharmacy(id, input);
        console.log(input);
        if (response.success) {
            setRefresh(!refresh);
            response?.data?.message &&
                popAlert("Success!", response?.data?.message, "success").then((res) => {
                    seteditShowPopup(false);
                });
        } else {
            response?.data?.message && popAlert("Error!", response?.data?.message, "error");
            response?.data?.data && setErrors(response.data.data);
        }
        setIsLoading(false);
    };

    //delete pharmacy
    const deletePharmacyhandleSubmit = async () => {
        setIsLoading(true);

        popDangerPrompt("DELETE", "Are You sure you want to delete this pharmacy!", "error").then(
            async (res) => {
                if (res.isConfirmed) {
                    const response = await deletePharmacy(id);

                    if (response.success) {
                        response?.data?.message &&
                            popAlert("Success!", response?.data?.message, "success").then((res) => {
                                setShowPopup(false);
                                window.location.replace("/pharmacy");
                            });
                    } else {
                        response?.data?.message &&
                            popAlert("Error!", response?.data?.message, "error");
                        response?.data?.data && setErrors(response.data.data);
                    }
                }
            }
        );
        setIsLoading(false);
    };

    const handleUpdateClear = () => {
        setInput(updatePharmacy);
    };

    const handleClear = () => {
        setInputs(medicine);
    };

    // const handleMapInput = (input) =>{
    //   setInput(input);
    // };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, page: page });
    };

    const handleLimitChange = (limit) => {
        setPagination({ ...pagination, limit: limit });
    };

    const handleEdit = (id) => {
        seteditShowPopup(true);
    };

    const handleDelete = (id) => {
        console.log(id);
    };

    const handleSearch = (input) => {
        setKeyword(input);
    };

    const memoizedLabel = useMemo(
        () => globalMedicines.find((medi) => medi.id === inputs.globalMedicine._id)?.label || "",
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [inputs.globalMedicine._id]
    );

    const throttle = (func, time) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(func, time);
    };

    //select pharmacies
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

    useEffect(() => {
        let unmounted = false;

        if (!unmounted) setIsLoading(true);

        const fetchAndSet = async () => {
            const response = await getAllMedicines(
                id,
                pagination.page,
                pagination.limit,
                pagination.orderBy,
                keyword
            );

            if (response.success) {
                if (!response.data) return;

                let tableDataArr = [];
                for (const medicine of response.data.content) {
                    tableDataArr.push({
                        name: medicine.global.doc.name,
                        strength: medicine.global.doc.strength,
                        stockLevel: medicine.stockLevel,
                        unitPrice: medicine.unitPrice,
                        action: (
                            <TableAction
                                id={medicine._id}
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
    }, [pagination, refresh, keyword, id]);

    //pharmacy find by id
    useEffect(() => {
        let unmounted = false;

        const fetchAndSet = async () => {
            const response = await getPharmacyById(id);

            if (response.success) {
                if (!unmounted) {
                    setPharmacydata(response?.data);
                    titleRef.current.innerHTML = response?.data?.name;
                    setInput(response?.data);
                }
            }
        };

        fetchAndSet();

        return () => {
            unmounted = true;
        };
    }, [id, refresh]);

    return (
        <React.Fragment>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                Pharamacy Profile
            </Typography>

            <Box
                sx={{
                    borderRadius: 4,
                    backgroundColor: colors.secondary,
                    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
                    p: 1,
                }}
            >
                <Stack flexDirection="row" alignItems="center">
                    <img
                        src="https://img.freepik.com/free-photo/young-woman-pharmacist-pharmacy_1303-25541.jpg?w=2000"
                        alt=""
                        style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 5,
                        }}
                    />

                    <Grid container sx={{ ml: 5 }}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ marginBottom: "5px", fontWeight: "bold" }}>
                                <Box ref={titleRef}></Box>
                            </Box>

                            <Box>
                                <Typography variant="p">
                                    {pharmacydata.registrationNumber}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ marginBottom: "5px" }}>
                                <Typography variant="p">{pharmacydata.address}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="p">{pharmacydata.contactNumber}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Box sx={{ marginBottom: "5px" }}>
                            <EditButton onClick={() => seteditShowPopup(true)} />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Box sx={{ marginBottom: "5px" }}>
                            <DeleteButton onClick={() => deletePharmacyhandleSubmit()} />
                        </Box>
                    </Grid>
                </Stack>
            </Box>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, mt: 4 }}>
                Medicines
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={11}>
                    <SearchBar onSearch={handleSearch} placeholderText="Search Medicines..." />
                </Grid>

                <Grid item xs={1}>
                    <AddButton onClick={() => setShowPopup(true)} /> {/**/}
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
            <Popup title="Add Medicine" width={800} show={showPopup} onClose={handlePopupClose}>
                <Box sx={{ mb: 2, mt: 1 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 2 }}>
                            <Autocomplete
                                id="combo-box-demo"
                                fullWidth
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                value={memoizedLabel}
                                onChange={(event, value) => {
                                    if (value?.id) {
                                        setInputs({
                                            ...inputs,
                                            globalMedicine: { _id: value.id },
                                        });
                                    } else {
                                        setInputs({
                                            ...inputs,
                                            globalMedicine: { _id: "" },
                                        });
                                    }
                                }}
                                options={globalMedicines}
                                loading={isLoading}
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
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                        />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            {errors["name"] && (
                                <Typography color="error">{errors["name"]}</Typography>
                            )}
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                name="unitPrice"
                                variant="filled"
                                label="Unit Price"
                                fullWidth
                                InputProps={{
                                    inputProps: { min: 0, step: "any", type: "number" },
                                    shrink: "true",
                                }}
                                value={inputs.unitPrice}
                                onChange={(e) =>
                                    setInputs({
                                        ...inputs,
                                        unitPrice: e.target.value,
                                    })
                                }
                            />
                            {errors["unitPrice"] && (
                                <Typography color="error">{errors["unitPrice"]}</Typography>
                            )}
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                name="stockLevel"
                                variant="filled"
                                label="Stock Level"
                                type="number"
                                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                                fullWidth
                                value={inputs.stockLevel}
                                onChange={(e) =>
                                    setInputs({
                                        ...inputs,
                                        stockLevel: e.target.value,
                                    })
                                }
                            />
                            {errors["stockLevel"] && (
                                <Typography color="error">{errors["stockLevel"]}</Typography>
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
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress color="secondary" /> : "Save"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Popup>

            {/*Update Pharmacy */}
            <Popup
                title="Edit Pharmacy"
                width={800}
                show={editShowPopup}
                onClose={edithandlePopupClose}
            >
                <Box sx={{ mb: 1 }}>
                    <form onSubmit={updatePharmacyhandleSubmit}>
                        <Box sx={{ mb: 1 }}>
                            <TextField
                                name="name"
                                variant="filled"
                                label="Enter Name"
                                fullWidth
                                value={input.name}
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        name: e.target.value,
                                    })
                                }
                            />
                            {errors["name"] && (
                                <Typography color="error">{errors["name"]}</Typography>
                            )}
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <TextField
                                name="registrationNumber"
                                variant="filled"
                                label="Enter Registration Number"
                                fullWidth
                                value={input.registrationNumber}
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        registrationNumber: e.target.value,
                                    })
                                }
                            />
                            {errors["registrationNumber"] && (
                                <Typography color="error">
                                    {errors["registrationNumber"]}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <TextField
                                name="address"
                                variant="filled"
                                label="Enter Address"
                                fullWidth
                                value={input.address}
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        address: e.target.value,
                                    })
                                }
                            />
                            {errors["address"] && (
                                <Typography color="error">{errors["address"]}</Typography>
                            )}
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <TextField
                                name="contactNumber"
                                variant="filled"
                                label="Enter Contact Number"
                                fullWidth
                                value={input.contactNumber}
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        contactNumber: e.target.value,
                                    })
                                }
                            />
                            {errors["contactNumber"] && (
                                <Typography color="error">{errors["contactNumber"]}</Typography>
                            )}
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <TextField
                                name="email"
                                variant="filled"
                                label="Enter Email"
                                fullWidth
                                value={input.email}
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        email: e.target.value,
                                    })
                                }
                            />
                            {errors["email"] && (
                                <Typography color="error">{errors["email"]}</Typography>
                            )}
                        </Box>

                        {/* <Box sx={{ mb: 1 }}>
              <Typography>Select Location</Typography>
                  <Paper elevation={0} sx={{height:200 }} >
                    <MapGoogal input={input} OnLocationChange={handleMapInput}/>
                  </Paper>
                       

                  {errors["location"] && (
                    <Typography color="error">{errors["location"]}</Typography>
                  )}
            </Box> */}

                        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                type="reset"
                                variant="contained"
                                onClick={handleUpdateClear}
                                sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
                            >
                                Clear
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ py: 2, px: 5 }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress color="secondary" /> : "Save"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Popup>
        </React.Fragment>
    );
};

export default PharmacyProfile;
