import store from "../store";
import { authActions } from "../store/authSlice";
import { popAlert } from "./alerts";

export const buildResponse = async (success, data, statusCode) => {
  if (
    statusCode &&
    statusCode === 401 &&
    !window.location.href.includes("auth")
  ) {
    await popAlert(
      "Error!",
      "You're session is invalid. Please login again!",
      "error",
      "Go to Login"
    ).then((res) => {
      store.dispatch(authActions.logout());
    });
  } else {
    return { success: success, data: data };
  }
};
