// 브라우저 환경에서만 안전하게 localStorage에 접근하는 헬퍼 함수들

export function getStorageItem(key: string, defaultValue?: string): string | null {
  if (typeof window === 'undefined') {
    return defaultValue || null
  }
  
  try {
    return localStorage.getItem(key) || defaultValue || null
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}":`, error)
    return defaultValue || null
  }
}

export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`Failed to set localStorage key "${key}":`, error)
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}":`, error)
  }
}

export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}