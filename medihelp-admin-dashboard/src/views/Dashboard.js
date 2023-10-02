import React from "react";
// import SearchBar from "../components/common/SearchBar";
// import AddButton from "../components/common/AddButton";
// import ReportButton from "../components/common/ReportButton";
import { Typography } from "@mui/material";

const Dashboard = () => {
  // const handleSearch = (input) => {};
  return (
    <React.Fragment>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      {/* <Grid container spacing={2}>
        <Grid item xs={10}>
          <SearchBar onSearch={handleSearch} />
        </Grid>
        <Grid item xs={1}>
          <AddButton />
        </Grid>
        <Grid item xs={1}>
        </Grid>
      </Grid> */}
    </React.Fragment>
  );
};

export default Dashboard;
