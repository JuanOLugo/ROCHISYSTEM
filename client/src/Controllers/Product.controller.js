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

export const DisminuirProduct = async (data) => {
  const response = await axios.post(proxy + "disminuir", data);
  return response;
};

export const PaginationProducts = async (data) => {
  const response = await axios.post(proxy + "page", data);
  return response;
};

export const FilterProducts = async (data) => {
  const response = await axios.post(proxy + "filter", data);
  return response;
};
