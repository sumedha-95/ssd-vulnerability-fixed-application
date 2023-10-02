import { getApi, getApiForFormData } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const createOrder = async (data) => {
  const response = await getApiForFormData()
    .post("/orders", data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const getAllOrders = async (page, limit, orderBy, status) => {
  const response = await getApi()
    .get("/orders", {
      params: {
        page,
        limit,
        orderBy,
        status,
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

export const confirmOrder = async (orderId) => {
  const response = await getApi()
    .patch(`/orders/${orderId}/confirm`, {})
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const rejectOrder = async (orderId) => {
  const response = await getApi()
    .patch(`/orders/${orderId}/reject`, {})
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const removeOrder = async (orderId) => {
  const response = await getApi()
    .delete(`/orders/${orderId}/remove`, {})
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};