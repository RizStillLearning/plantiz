export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 64

export function emailError(email) {
  if (!email.trim()) return 'Enter your email address.'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter an email address like name@example.com.'
  return null
}

// The first invalid field, in the order the form shows them.
export const firstInvalid = (errors, order) => order.find((field) => errors[field])
