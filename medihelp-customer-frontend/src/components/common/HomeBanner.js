import React from "react";
import Card from "@mui/material/Card";
import {Box,Grid} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import home from '../../assets/styles/Image/home.jpg';
import colors from '../../assets/styles/colors';
import ExploreButton from '../../assets/styles/components/ExploreButton';

const HomeBanner = () => {

  const handleClick = async (e) => {
            window.location.replace("/map-google"); 
      };

  return (
    <Card
      sx={{
        height:"100vh",
      }}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        // backgroundSize= 'cover'
        image={home}
        position="relative"
      /> 


   <Grid container spacing={2} direction="column">
    <Grid item xs={6}>
      
       <Typography component={"span"}>
            <Box sx={{  
            fontSize: 'h6.fontSize',
            position: "absolute",
            top: "25%",
            width: "60%",
            ml:7,
            color:colors.primary,}}>
            
            MediHelp is a platform where customers can find nearest pharmacies and order medicines easily by simply uploading the prescription sheet.
            The primary focus of this platform is to assist users to find medicines that are harder to find.
            In addition, for pharmacy owners, there will be an admin dashboard  to manage medicines, pharmacies, orders, etc.
            </Box>
      </Typography> 
      
     </Grid>
     <Grid item xs={4}>
      
      <Typography component="div" variant="h1" gutterBottom>
            <Box sx={{  
            fontSize: 'h2.fontSize',
            position: "absolute",
            top: "60%",
            width: "50%",
            fontWeight: 'bold',
            ml:7,
            color:colors.primary,}}>
              
              Best Way to Find Medicine
            </Box>
  </Typography> 
     </Grid>
    
  <Grid item xs={2}>
        
     <Box 
    sx={{           
            position: "absolute",
            top: "90%",
          }} 
    >
        <ExploreButton onClick={handleClick}/>
    </Box> 
        

     </Grid>

   </Grid>
  </Card>
  );
};
export default HomeBanner;
