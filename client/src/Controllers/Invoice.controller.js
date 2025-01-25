import axios from "axios";

const proxy = "http://localhost:8528/api/invoice/";

export const CreateInvoiceAPI = async (data) => {
  const response = await axios.post(proxy + "create", data);
  return response;
};

export const GetInvoiceAPI = async (data) => {
  const response = await axios.post(proxy + "get", data);
  return response;
};

export const UpdateProductsAPI = async (data) => {
  const response = await axios.post(proxy + "update", data);
  return response;
};

export const DeleteInvoiceAPI = async (data) => {
  const response = await axios.post(proxy + "delete", data);
  return response;
};

export const VERIFYTOTALWINDAY = async (data) => {
  return await axios.post(proxy + "verifyTotalWinDay", data);
};
