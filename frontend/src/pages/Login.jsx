import AuthLayout from '../components/AuthLayout.jsx'
import Island from '../components/Island.jsx'
import LoginForm from '../islands/LoginForm.jsx'

export default function Login() {
  return (
    <AuthLayout
      currentPath="/login"
      title="Welcome back"
      lede="Log in to browse the plant library, get matched with plants and identify them from photos."
      form={<Island name="LoginForm" component={LoginForm} />}
      switchPrompt={
        <>
          New to Plantiz?{' '}
          <a className="text-link" href="/signup">
            Create an account
          </a>
        </>
      }
    />
  )
}
