import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import colors from "../../assets/styles/colors";

const AddButton = ({ onClick }) => {
  return (
    <React.Fragment>
      <Box>
        <Button
          variant="contained"
          size="large"
          onClick={onClick}
          sx={{
            backgroundColor: colors.purpal,
            height: 56,
            borderRadius: "5px 5px 5px 5px",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: colors.darkPurpal },
          }}
        >
          <AddIcon />
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default AddButton;
