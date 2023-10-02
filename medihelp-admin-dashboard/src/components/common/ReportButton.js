import React, { useRef } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import { Box, Button, CircularProgress } from "@mui/material";
import colors from "../../assets/styles/colors";
import { useReactToPrint } from "react-to-print";
import { useEffect } from "react";

const ReportButton = ({ children, setComponentRef, isLoading }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () =>
      (document.title = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} Report`),
  });

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setComponentRef(componentRef);

    return () => {
      unmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Box>
        <Button
          onClick={() => {
            handlePrint();
          }}
          variant="contained"
          size="large"
          sx={{
            backgroundColor: colors.green,
            height: 56,
            borderRadius: "5px 5px 5px 5px",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: colors.darkGreen },
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={25} color={"secondary"} />
          ) : (
            <ArticleIcon />
          )}
        </Button>
        <div style={{ visibility: "hidden", height: 0 }}>
          <>{children}</>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default ReportButton;
