import Swal from "sweetalert2";
import colors from "../assets/styles/colors";

export const popAlert = (title, text, icon, confirmButtonText) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: confirmButtonText || "Ok",
    confirmButtonColor: colors.primary,
  });
};
