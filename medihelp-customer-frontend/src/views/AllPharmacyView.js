import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MediaCard from "../components/common/MediaCard";
import SearchBar from "../components/common/SearchBar";
import { getPharmaciesByNearestLocation } from "../service/pharmacy.service";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AllPharmacyView = () => {
  const authState = useSelector((state) => state.auth);
  const mapState = useSelector((state) => state.map);

  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  const [pharmacydata, setPharmacydata] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  const handleSearch = (input) => {
    setKeyword(input);
  };

  useEffect(() => {
    let unmounted = false;

    const fetchAndSet = async () => {
      const response = await getPharmaciesByNearestLocation(page, 6, "desc",mapState.latitude,mapState.longitude,keyword);
    
      if (response.success){
        if(!unmounted){
          setPharmacydata(response?.data?.content || []);
          setTotalPages(response?.data?.totalPages || 0);
        }
      }
    }

    fetchAndSet();

    return () =>{
      unmounted = true;
    }
  }, [authState, mapState, page, keyword]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mt: 2, p: 3, width: "80%", ml: 15 }}>
        <SearchBar 
         onSearch={handleSearch}
         placeholderText="Search Pharmacies..."
         />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
        Neareast Pharmacies
      </Typography>
      <Box
        sx={{
          m: 2,
          borderRadius: 15,
        }}
      >
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {pharmacydata.map((item, index) => (
            <Grid item xs={12} sm={12} md={4} lg={3} key={index}>
              <Link
                to={`/pharmacies/${item._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MediaCard
                  name={item.name}
                  contactNumber={item.contactNumber}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ ml: 130 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          fontWeight={"bold"}
        />
      </Box>
    </Box>
  );
};
export default AllPharmacyView;
