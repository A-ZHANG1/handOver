import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const CurrentUser = 'User-ID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserId(id) {
  return Cookies.set(CurrentUser, id)
}

export function getUserId() {
  return Cookies.get(CurrentUser)
}

export function removeUserId() {
  return Cookies.remove(CurrentUser)
}
