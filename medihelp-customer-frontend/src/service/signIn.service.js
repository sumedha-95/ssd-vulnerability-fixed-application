import { getApi} from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const createUser = async (data) => {
    const response = await getApi()
      .post("/auth/login", data)
      .then((res) => {
        return buildResponse(true, res.data);
      })
      .catch((err) => {
        return buildResponse(false, err.response.data, err.response.status);
      });
  
    return response;
};