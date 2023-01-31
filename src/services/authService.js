import http from "./httpService";
import config from "../config.json";
const { apiUrl } = config;
const apiEndpoint = `${apiUrl}/auth`;
const authTokenKey = "auth_token";
const accessTokenKey = "access_token";
const userData = "user_data";
const userRole = "user_role";

http.setJwt(getJwt() ? getJwt().token : "");

async function login(user) {
  console.log(apiUrl);
  return await http.post(`${apiEndpoint}/login`, user);
}

async function register(user) {
  return http.post(`${apiEndpoint}/register`, user);
}

function storeLoginData(data) {
  localStorage.setItem(authTokenKey, JSON.stringify(data.tokens.auth));
  localStorage.setItem(accessTokenKey, JSON.stringify(data.tokens.access));
  localStorage.setItem(userData, JSON.stringify(data.user));
  let userRoleData = {};
  userRoleData["role"] = data.user[0].role;
  localStorage.setItem(userRole, JSON.stringify(userRoleData));
}

async function logout(userId) {
  localStorage.removeItem(authTokenKey);
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(userData);
  localStorage.removeItem(userRole);
  console.log(this.token);
  return await http.post(`${apiEndpoint}/logout`, { userId });
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(userData));
  } catch (ex) {
    return null;
  }
}

function getCurrentRole() {
  try {
    return JSON.parse(localStorage.getItem(userRole));
  } catch (ex) {
    return null;
  }
}

async function getCurrentUserData() {
  return http.post(`${apiEndpoint}/users`);
}

function getJwt() {
  return JSON.parse(localStorage.getItem(accessTokenKey));
}

export default {
  login,
  register,
  storeLoginData,
  logout,
  getCurrentUser,
  getCurrentRole,
  getJwt,
  getCurrentUserData,
};
