import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/service";

async function getServices() {
  return http.get(`${apiEndpoint}`);
}

async function getService(serviceId) {
  return http.get(`${apiEndpoint}/${serviceId}`);
}

async function addService(serviceData) {
  return http.post(`${apiEndpoint}`, serviceData);
}

async function updateService(serviceData) {
  return http.put(`${apiEndpoint}/${serviceData._id}`, serviceData);
}

async function deleteService(serviceId) {
  return http.delete(`${apiEndpoint}/${serviceId}`);
}

export default {
  getService,
  getServices,
  addService,
  updateService,
  deleteService,
};
