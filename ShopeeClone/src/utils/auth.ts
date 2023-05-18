import { User } from 'src/types/user.type'

export const localStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const removeLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  const clearEvent = new Event('clearLS')
  localStorageEventTarget.dispatchEvent(clearEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const setProfileToLS = (profile: User) => {
  const userProfile = JSON.stringify(profile)
  localStorage.setItem('profile', userProfile)
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}
