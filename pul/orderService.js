import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/order";

async function getOrders() {
  return http.get(`${apiEndpoint}`);
}
async function getOrderByEmp(empId) {
  return http.get(`${apiEndpoint}/emp/${empId}`);
}

// async function getOrder(serviceId) {
//   return http.get(`${apiEndpoint}/${serviceId}`);
// }

// async function addService(serviceData) {
//   return http.post(`${apiEndpoint}`, serviceData);
// }

async function updateorder(orderData, orderId) {
  return http.put(`${apiEndpoint}/${orderId}`, orderData);
}

async function deleteOrder(orderId) {
  return http.delete(`${apiEndpoint}/${orderId}`);
}

export default {
  getOrders,
  getOrderByEmp,
  updateorder,
  deleteOrder,
};
