import http from "./httpService";
import config from "../config.json";
const { apiUrl } = config;

const apiEndpoint = apiUrl + "/email";

async function sendEmail(emailData) {
  return http.post(`${apiEndpoint}`, emailData);
}

async function getemail(emailData) {
  return http.get(`${apiEndpoint}/${emailData}`);
}
async function deletecode(email) {
  return http.delete(`${apiEndpoint}/${email}`);
}
export default {
  sendEmail,
  getemail,
  deletecode,
};
