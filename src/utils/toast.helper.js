export const showSuccess = (toast, message) => {
  toast.current.show({
    severity: 'success',
    summary: 'Success',
    detail: message,
    life: 3000,
  })
}

export const showInfo = (toast, message) => {
  toast.current.show({
    severity: 'info',
    summary: 'Info',
    detail: message,
    life: 3000,
  })
}

export const showWarn = (toast, message) => {
  toast.current.show({
    severity: 'warn',
    summary: 'Warning',
    detail: message,
    life: 3000,
  })
}

export const showError = (toast, message) => {
  toast.current.show({
    severity: 'error',
    summary: 'Error',
    detail: message,
    life: 3000,
  })
}
