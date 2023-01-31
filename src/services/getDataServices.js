import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/getdata";

async function getData() {
  return http.get(`${apiEndpoint}`);
}
async function getEmpData(userId) {
  return http.get(`${apiEndpoint}/${userId}`);
}

export default {
  getData,
  getEmpData,
};
