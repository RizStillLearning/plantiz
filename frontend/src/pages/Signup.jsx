import AuthLayout from '../components/AuthLayout.jsx'
import Island from '../components/Island.jsx'
import SignupForm from '../islands/SignupForm.jsx'

export default function Signup() {
  return (
    <AuthLayout
      currentPath="/signup"
      title="Create your account"
      lede="It is free. Once you are in, you can browse the library, get matched with plants and identify them from photos."
      form={<Island name="SignupForm" component={SignupForm} />}
      switchPrompt={
        <>
          Already have an account?{' '}
          <a className="text-link" href="/login">
            Log in
          </a>
        </>
      }
    />
  )
}
