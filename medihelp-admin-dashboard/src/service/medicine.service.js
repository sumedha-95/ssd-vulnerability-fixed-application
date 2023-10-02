import { getApi } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const createMedicine = async (id, data) => {
  const response = await getApi()
    .post(`/medicines/pharmacies/${id}`, data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getMedinceByGID = async (gMedicineId, pharmacyId) => {
  const response = await getApi()
    .get(`/medicines/global-medicines/${gMedicineId}/pharmacies/${pharmacyId}`)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getAllMedicines = async (pharmacyId, page, limit, orderBy) => {
  const response = await getApi()
    .get(`/medicines/pharmacies/${pharmacyId}`, {
      params: {
        page,
        limit,
        orderBy,
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