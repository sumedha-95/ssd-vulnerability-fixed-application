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
      if (res.isConfirmed) {
        window.location.replace("/auth/sign-in");
        return;
      }
    });
  } else {
    return { success: success, data: data };
  }
};
