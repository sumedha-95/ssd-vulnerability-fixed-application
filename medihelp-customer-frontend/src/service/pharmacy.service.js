import { getApi} from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const getPharmaciesByNearestLocation = async (page,limit,orderBy,lat,lng,keyword) => {
    const response = await getApi()
      .get("/pharmacies/v/customer", {
        params: {
          page,
          limit,
          orderBy,
          lat,
          lng,
          keyword
        },
      })
      .then((res) => {
        return buildResponse(true, res.data);
      })
      .catch((err) => {
        return buildResponse(false, err.response.data, err.response.status);
      });
  
    return response;
  };
  