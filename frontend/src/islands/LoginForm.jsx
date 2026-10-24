import { useRef, useState } from 'react'
import { FormAlert, SubmitButton } from '../components/form/FormStatus.jsx'
import TextField, { PasswordField } from '../components/form/TextField.jsx'
import { logIn } from '../lib/api.js'
import { nextPath, saveSession } from '../lib/session.js'
import { emailError, firstInvalid } from '../lib/validation.js'

const FIELDS = ['email', 'password']

function validate({ email, password }) {
  return {
    email: emailError(email),
    password: password ? null : 'Enter your password.',
  }
}

export default function LoginForm() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

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
      const refs = { email: emailRef, password: passwordRef }
      refs[invalid].current.focus()
      return
    }

    setPending(true)
    try {
      saveSession(await logIn(values.email.trim(), values.password))
      window.location.assign(nextPath())
    } catch (error) {
      setFormError(error.message)
      setPending(false)
    }
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <TextField
        id="login-email"
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
      <PasswordField
        id="login-password"
        label="Password"
        autoComplete="current-password"
        value={values.password}
        onChange={update('password')}
        error={errors.password}
        inputRef={passwordRef}
      />
      <FormAlert>{formError}</FormAlert>
      <SubmitButton pending={pending} pendingLabel="Logging in…">
        Log in
      </SubmitButton>
    </form>
  )
}
