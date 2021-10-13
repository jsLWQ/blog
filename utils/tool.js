import { invitationSalt } from '../config/config.js'

const sessionStorageSetItem = (name, data) => {
  window.sessionStorage.setItem(invitationSalt + name, JSON.stringify({ [invitationSalt + name]: data }))
}

const sessionStorageGetItem = (name) => {
  const ls = window.sessionStorage.getItem(invitationSalt + name)
  if (ls) {
    return JSON.parse(ls)[invitationSalt + name]
  } else {
    return undefined
  }
}

const sessionStorageRemoveItem = (name) => {
  window.sessionStorage.removeItem(invitationSalt + name);
}

const localStorageSetItem = (name, data) => {
  const setName = `${invitationSalt}${name}`
  localStorage.setItem(setName, JSON.stringify({ [setName]: data }))
} 

const localStorageGetItem = (name) => {
  const getName = `${invitationSalt}${name}`
  const ls = localStorage.getItem(getName)
  if (ls) {
    return JSON.parse(ls)[getName]
  } else {
    return undefined
  }
}

const localStorageRemoveItem = (name) => {
  localStorage.removeItem(invitationSalt + name)
}

export {
  sessionStorageSetItem,
  sessionStorageGetItem,
  sessionStorageRemoveItem,
  localStorageSetItem,
  localStorageGetItem,
  localStorageRemoveItem
}