import React, { useState } from 'react'
import { GoogleMap,Marker,useLoadScript } from '@react-google-maps/api'
import '../assets/styles/GoogelMap/mapGoogel.css'
import {
  Typography,
  Box,
  Grid,
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContinueButton from '../assets/styles/components/ContinueButton';
import { setMap } from '../store/mapSlice';
import { useDispatch } from "react-redux";

const MapGoogle =() => {
      
    //define default coords
    const [coords, setCoords] = useState({ lat:parseFloat(6.927079) , lng: parseFloat(79.861244) });

    const [zoom, setZoom] = useState(8);
    const [mapMarker, setMapMarker] = useState(false);
    const [inputs, setInputs] = useState();
  
    const dispatch = useDispatch();


    const handleClick = async (e) => {
      window.location.replace("/pharmacies"); 
  };

    const handleMapInput = (inputs) =>{
      setInputs(inputs);
        dispatch(setMap.setLocation(inputs));
      console.log(inputs)

    };

    //load gopgel map API
    const {isLoaded}=useLoadScript({
        googleMapsApiKey:"AIzaSyAXqrbE_WqGgouE09hnobUk3L-8h3OrmqY",
    })
    
    function handleZoomChanged() {
      setZoom(this.getZoom());
       //this refers to Google Map instance
      let newLocation = this.getCenter();
      setCoords({ lat: newLocation.lat(), lng: newLocation.lng() });
    }

    if (!isLoaded) return <div>Loading...</div>;
  

  return (
 <div>
   <Box sx={{height:100}}>
    <Grid container spacing={4}>
        <Grid item xs={9}>
        <Typography variant="h5" fontWeight="bold" sx={{mt:2}}>
          <LocationOnIcon/> Pin Your Location
        </Typography>
        </Grid>
        <Grid item xs={3} sx={{mt:1}}>
          <ContinueButton onClick={handleClick} />        
        </Grid>
      </Grid>
   </Box>
    <div>
        {/* check googel map is loaded or not */}
         {isLoaded&&(
        <GoogleMap
            center={coords}
            zoom={zoom}
            mapContainerClassName="map-container"
            margin={[50, 50, 50, 50]}
            options={{ zoomControl: true}}
            onZoomChanged={handleZoomChanged}
            onClick={(e)=>{
              setMapMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })
              handleMapInput({
                  ...inputs,
                  location: {
                      "latitude": e.latLng.lat(),
                      "longitude":  e.latLng.lng()
                  }
                })
          }}
        >
           
        {mapMarker && (
        <Marker 
          position={mapMarker}
         
        />
      )}  
        </GoogleMap>
    )}  
    </div>
  </div>
  )
}

export default MapGoogle