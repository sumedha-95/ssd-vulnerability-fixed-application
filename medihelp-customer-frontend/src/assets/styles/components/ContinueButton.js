import React from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button } from "@mui/material";
import colors from "../colors";


const ContinueButton = ({onClick}) => {

  return (
    <React.Fragment>
      <Box>
        <Button
          variant="contained"
          onClick={onClick}
          sx={{
            height: 50,
            borderRadius: "5px 5px 5px 5px",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: colors.primary },
            ml:14,
            fontWeight: 'bold',
          }}>
         Continue  <ArrowForwardIcon sx={{m:1}}/>
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default ContinueButton;
