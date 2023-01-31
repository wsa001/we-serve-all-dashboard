import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/providerlocation";

// async function getOrders() {
//   return http.get(`${apiEndpoint}`);
// }
// async function getOrderByEmp(empId) {
//   return http.get(`${apiEndpoint}/emp/${empId}`);
// }

async function getplocation(userId) {
  console.log(apiEndpoint);
  return http.get(`${apiEndpoint}/${userId}`);
}

async function addProviderLocation(plocationData) {
  return http.post(`${apiEndpoint}`, plocationData);
}

// async function updateorder(orderData, orderId) {
//   return http.put(`${apiEndpoint}/${orderId}`, orderData);
// }

// async function deleteOrder(orderId) {
//   return http.delete(`${apiEndpoint}/${orderId}`);
// }

export default {
  getplocation,
  addProviderLocation,
};
