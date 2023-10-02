import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconsWrapper } from "./NavBar";

const style = { cursor: "pointer" };

const TableAction = ({ id, onView, onEdit, onDelete }) => {
  return (
    <React.Fragment>
      <IconsWrapper>
        {typeof onView === "function" && (
          <VisibilityIcon
            color="action"
            sx={{ ...style }}
            onClick={() => onView(id)}
          />
        )}
        {typeof onEdit === "function" && (
          <EditIcon
            color="warning"
            sx={{ ...style }}
            onClick={() => onEdit(id)}
          />
        )}
        {typeof onDelete === "function" && (
          <DeleteIcon
            color="error"
            sx={{ ...style }}
            onClick={() => onDelete(id)}
          />
        )}
      </IconsWrapper>
    </React.Fragment>
  );
};

export default TableAction;
