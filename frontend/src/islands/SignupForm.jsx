import { useRef, useState } from 'react'
import { FormAlert, SubmitButton } from '../components/form/FormStatus.jsx'
import TextField, { PasswordField } from '../components/form/TextField.jsx'
import { signUp } from '../lib/api.js'
import { HOME_PATH, saveSession } from '../lib/session.js'
import { emailError, firstInvalid, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../lib/validation.js'

const FIELDS = ['name', 'email', 'password', 'confirmPassword']

function passwordError(password) {
  if (!password) return 'Create a password.'
  if (password.length < PASSWORD_MIN_LENGTH) return `Use at least ${PASSWORD_MIN_LENGTH} characters.`
  if (password.length > PASSWORD_MAX_LENGTH) return `Use ${PASSWORD_MAX_LENGTH} characters or fewer.`
  return null
}

function validate({ name, email, password, confirmPassword }) {
  return {
    name: name.trim() ? null : 'Enter your name.',
    email: emailError(email),
    password: passwordError(password),
    confirmPassword: !confirmPassword
      ? 'Enter your password again.'
      : confirmPassword !== password
        ? 'The passwords do not match.'
        : null,
  }
}

export default function SignupForm() {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  const update = (field) => (event) => {
    const { value } = event.target
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: null }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    const found = validate(values)
    setErrors(found)
    const invalid = firstInvalid(found, FIELDS)
    if (invalid) {
      const refs = { name: nameRef, email: emailRef, password: passwordRef, confirmPassword: confirmPasswordRef }
      refs[invalid].current.focus()
      return
    }

    setPending(true)
    try {
      saveSession(
        await signUp({ name: values.name.trim(), email: values.email.trim(), password: values.password }),
      )
      window.location.assign(HOME_PATH)
    } catch (error) {
      setPending(false)
      if (error.status === 409) {
        setErrors({ email: 'An account with this email already exists. Log in instead.' })
        emailRef.current.focus()
      } else {
        setFormError(error.message)
      }
    }
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <TextField
        id="signup-name"
        label="Name"
        autoComplete="name"
        placeholder="Jane Gardener"
        value={values.name}
        onChange={update('name')}
        error={errors.name}
        inputRef={nameRef}
      />
      <TextField
        id="signup-email"
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={values.email}
        onChange={update('email')}
        error={errors.email}
        inputRef={emailRef}
      />
      <div className="form__row">
        <PasswordField
          id="signup-password"
          label="Password"
          hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
          autoComplete="new-password"
          value={values.password}
          onChange={update('password')}
          error={errors.password}
          inputRef={passwordRef}
        />
        <PasswordField
          id="signup-confirm-password"
          label="Confirm password"
          hint="Type it once more."
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={update('confirmPassword')}
          error={errors.confirmPassword}
          inputRef={confirmPasswordRef}
        />
      </div>
      <FormAlert>{formError}</FormAlert>
      <SubmitButton pending={pending} pendingLabel="Creating your account…">
        Create account
      </SubmitButton>
    </form>
  )
}
