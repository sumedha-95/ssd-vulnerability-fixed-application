import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button } from "@mui/material";
import colors from "../../assets/styles/colors";

const DeleteButton = ({ onClick }) => {
  return (
    <React.Fragment>
      <Box>
        <Button
          variant="contained"
          size="large"
          onClick={onClick}
          sx={{
            backgroundColor: colors.red,
            height: 56,
            borderRadius: "5px 5px 5px 5px",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: colors.primary },
          }}
        >
          <DeleteIcon />
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default DeleteButton;
