import React from "react";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Box, Button } from "@mui/material";
import colors from "../../assets/styles/colors";

const EditButton = ({ onClick }) => {
  return (
    <React.Fragment>
      <Box>
        <Button
          variant="contained"
          size="large"
          onClick={onClick}
          sx={{
            backgroundColor: colors.primary,
            height: 56,
            borderRadius: "5px 5px 5px 5px",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: colors.primary },
          }}
        >
          <BorderColorIcon />
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default EditButton;
