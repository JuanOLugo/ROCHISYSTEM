import axios from "axios";

const proxy = "http://localhost:8528/api/product/";

export const CreateProductAPI = async (data) => {
  const response = await axios.post(proxy + "create", data);
  return response;
};

export const GetProductAPI = async (data) => {
  const response = await axios.get(proxy + "get", data);
  return response;
};

export const UpdateProductsAPI = async (data) => {
  const response = await axios.post(proxy + "update", data);
  return response;
};

export const DeleteProductAPI = async (data) => {
  const response = await axios.post(proxy + "delete", data);
  return response;
};

export const GETPRODUCTCODE = async (data) => {
  return await axios.get(proxy + "getproductcode", data);
};

export const GETPRODUCTBYCODE = async (data) => {
  return await axios.post(proxy + "getproductbycode", data);
};


export const GETPRODUCTBYNAME = async (data) => {
  return await axios.post(proxy + "getproductbyname", data);
};
