import { Box, Grid, Modal, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import popupStyles from "../../assets/styles/components/popup";
import CloseIcon from "@mui/icons-material/Close";

const Popup = ({ title, width, show, onClose, children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setOpen(show);

    return () => {
      unmounted = true;
    };
  }, [show]);

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...popupStyles, width: width ? width : 300 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  pl: 4,
                  pr: 4,
                }}
              >
                <Grid container>
                  <Grid item xs={10}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {" "}
                      {title}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack flexDirection="row" justifyContent="flex-end">
                      <CloseIcon
                        color="error"
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={onClose}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  mt: 2,
                  pl: 4,
                  pr: 4,
                }}
              >
                {children ? children : <></>}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default Popup;
