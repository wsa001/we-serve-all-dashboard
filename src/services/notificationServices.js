import http from "./httpService";
import config from "../config.json";
const { apiUrl } = config;

const apiEndpoint = apiUrl + "/notification";

async function getNotification(userId) {
  console.log(apiEndpoint);
  return http.get(`${apiEndpoint}/user/${userId}`);
}

async function addNotification(notificationData) {
  return http.post(`${apiEndpoint}`, notificationData);
}

async function deleteNotification(notificationId) {
  return http.delete(`${apiEndpoint}/${notificationId}`);
}

export default {
  getNotification,
  addNotification,
  deleteNotification,
};
