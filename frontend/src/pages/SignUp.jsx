import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../api/supabaseClient'
import AuthLayout from '../components/AuthLayout'

function SignUp() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setLoading(true)
        const { data, error } = await supabase.auth.signUp({ email, password })
        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        if (data.session) {
            navigate('/')
            return
        }

        setSuccess('Account created! Check your email to confirm it before logging in.')
    }

    return (
        <AuthLayout title="Create your account" subtitle="Join Plantiz and start growing smarter.">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}
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
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control form-control-lg"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control form-control-lg"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button type="submit" className="btn btn-success btn-lg w-100 rounded-4" disabled={loading}>
                    {loading ? 'Creating account…' : 'Sign Up'}
                </button>
            </form>
            <p className="text-center text-secondary mt-4 mb-0">
                Already have an account? <Link to="/login" className="text-success fw-semibold text-decoration-none">Log in</Link>
            </p>
        </AuthLayout>
    )
}

export default SignUp
