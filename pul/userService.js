import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";

async function createUser(user) {
  return http.post(`${apiEndpoint}`, user);
}
async function getUsers() {
  return http.get(`${apiEndpoint}`);
}
async function updateUSer(userData) {
  return http.put(`${apiEndpoint}/${userData._id}`, userData);
}

async function deleteUser(userId) {
  return http.delete(`${apiEndpoint}/${userId}`);
}
export default {
  createUser,
  getUsers,
  deleteUser,
};
