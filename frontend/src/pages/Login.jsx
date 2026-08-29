import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/client'
import AuthLayout from '../components/AuthLayout'

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(email, password)
            navigate('/planner')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout title="Welcome back" subtitle="Log in to keep growing your plant collection.">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control form-control-lg"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success btn-lg w-100 rounded-4" disabled={loading}>
                    {loading ? 'Logging in…' : 'Login'}
                </button>
            </form>
            <p className="text-center text-secondary mt-4 mb-0">
                Don't have an account? <Link to="/signup" className="text-success fw-semibold text-decoration-none">Sign up</Link>
            </p>
        </AuthLayout>
    )
}

export default Login
