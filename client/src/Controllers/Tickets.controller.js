import axios from "axios";

const proxy = "http://localhost:8528/api/tickets/";

export const GenerateTicketsAPI = async (data) => {
  const response = await axios.post(proxy + "generateticket", data);
  return response;
};