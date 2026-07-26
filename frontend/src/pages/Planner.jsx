import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getRecommendations } from '../api/client'

const defaultForm = {
    light: 'bright',
    humidity: 'medium',
    temperature_c: 24,
    space: 'medium',
    experience: 'beginner',
    pets: false,
    weather: 'sunny',
    dryness: 'medium',
}

function Planner() {
    const navigate = useNavigate()
    const [form, setForm] = useState(defaultForm)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [chatInput, setChatInput] = useState('')
    const [chatReply, setChatReply] = useState('Ask me about watering, low light, or pet-safe picks.')
    const [chatLoading, setChatLoading] = useState(false)
    const [weatherStatus, setWeatherStatus] = useState('Checking your local weather...')

    const recommendationSummary = useMemo(() => {
        if (!results.length) return 'Fill in your environment and let Plantiz suggest a few plants that fit your space.'
        return `${results[0].common_name} is the strongest fit based on your current conditions.`
    }, [results])

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setWeatherStatus('Location access is unavailable in this browser.')
            return
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current=temperature_2m,precipitation,wind_speed_10m&timezone=auto`
                const response = await fetch(url)
                const payload = await response.json()
                const current = payload.current || {}
                const temp = Math.round(current.temperature_2m ?? 24)
                const precipitation = current.precipitation ?? 0
                const wind = current.wind_speed_10m ?? 0

                let weather = 'sunny'
                if (precipitation > 2) {
                    weather = 'rainy'
                } else if (wind > 8) {
                    weather = 'windy'
                } else if (temp < 18) {
                    weather = 'cloudy'
                }

                let dryness = 'medium'
                if (precipitation > 2) {
                    dryness = 'low'
                } else if (temp > 28) {
                    dryness = 'high'
                }

                setForm((previous) => ({ ...previous, temperature_c: temp, weather, dryness }))
                setWeatherStatus('Live weather synced from your location.')
            } catch {
                setWeatherStatus('Live weather is unavailable right now.')
            }
        }, () => {
            setWeatherStatus('Location access was denied, so the planner is using defaults.')
        })
    }, [])

    async function handleSubmit(event) {
        event.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = await getRecommendations({ ...form })
            setResults(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    function handleSignOut() {
        navigate('/login')
    }

    async function handleChatSubmit(event) {
        event.preventDefault()
        if (!chatInput.trim()) return
        setChatLoading(true)
        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: chatInput, context: results.map((plant) => plant.common_name) }),
            })
            const payload = await response.json()
            setChatReply(payload.reply || 'I can help with care tips and plant picks.')
        } catch (err) {
            setChatReply('The assistant is currently unavailable, but your recommendations are ready.')
        } finally {
            setChatLoading(false)
            setChatInput('')
        }
    }

    return (
        <>
            <header className="home-navbar">
                <nav className="navbar navbar-expand-lg bg-success-subtle px-5">
                    <Link to="/" className="navbar-brand text-success fs-1 fw-bold d-flex flex-row align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40" fill="currentColor" className="bi bi-leaf-fill" viewBox="0 0 16 16">
                            <path d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z" />
                        </svg>
                        Plantiz
                    </Link>
                    <div className="ms-auto">
                        <button type="button" className="btn btn-outline-danger rounded-4" onClick={handleSignOut}>
                            Sign out
                        </button>
                    </div>
                </nav>
            </header>
            <main>
                <section className="py-5 bg-white" id="planner">
                    <div className="container-fluid px-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="fw-bold mb-1">Planner</h1>
                                <p className="text-secondary mb-0">Build your environment profile and get plant recommendations.</p>
                            </div>
                        </div>
                        <div className="row g-4 align-items-start">
                            <div className="col-lg-5">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div>
                                            <h2 className="fw-bold mb-1">Environment planner</h2>
                                            <p className="text-secondary mb-0">Tell Plantiz what your room feels like and it will suggest compatible plants.</p>
                                        </div>
                                        <span className="badge bg-success-subtle text-success rounded-pill">Live</span>
                                    </div>
                                    <div className="alert alert-light border mb-4 py-2 px-3 small text-secondary">
                                        {weatherStatus}
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Light</label>
                                                <select className="form-select" value={form.light} onChange={(event) => setForm({ ...form, light: event.target.value })}>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="bright">Bright</option>
                                                    <option value="direct">Direct sun</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Humidity</label>
                                                <select className="form-select" value={form.humidity} onChange={(event) => setForm({ ...form, humidity: event.target.value })}>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Temperature</label>
                                                <input type="number" className="form-control" value={form.temperature_c} onChange={(event) => setForm({ ...form, temperature_c: Number(event.target.value) })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Space</label>
                                                <select className="form-select" value={form.space} onChange={(event) => setForm({ ...form, space: event.target.value })}>
                                                    <option value="small">Small</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="large">Large</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Weather</label>
                                                <select className="form-select" value={form.weather} onChange={(event) => setForm({ ...form, weather: event.target.value })}>
                                                    <option value="sunny">Sunny</option>
                                                    <option value="cloudy">Cloudy</option>
                                                    <option value="rainy">Rainy</option>
                                                    <option value="windy">Windy</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Dryness</label>
                                                <select className="form-select" value={form.dryness} onChange={(event) => setForm({ ...form, dryness: event.target.value })}>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Experience</label>
                                                <select className="form-select" value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })}>
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="expert">Expert</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" checked={form.pets} onChange={(event) => setForm({ ...form, pets: event.target.checked })} />
                                                    <label className="form-check-label">I have pets</label>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-success w-100 mt-4 rounded-4" type="submit" disabled={loading}>
                                            {loading ? 'Matching plants...' : 'Recommend plants'}
                                        </button>
                                    </form>
                                    {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                                    <div className="d-flex justify-content-between align-items-start gap-3">
                                        <div>
                                            <h3 className="fw-bold mb-1">Best matches</h3>
                                            <p className="text-secondary mb-0">{recommendationSummary}</p>
                                        </div>
                                        <span className="badge bg-success-subtle text-success rounded-pill px-3">{results.length ? `${results.length} picks` : 'Ready'}</span>
                                    </div>
                                </div>
                                <div className="row g-3">
                                    {results.length ? results.map((plant) => (
                                        <div className="col-md-6" key={plant.id}>
                                            <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                                                <div className="d-flex justify-content-between align-items-start gap-2">
                                                    <div>
                                                        <h5 className="fw-bold mb-1">{plant.common_name}</h5>
                                                        <p className="text-secondary small mb-2">{plant.scientific_name}</p>
                                                    </div>
                                                    <span className="badge bg-success-subtle text-success">{plant.match_score}%</span>
                                                </div>
                                                <p className="text-secondary small mb-3">{plant.description}</p>
                                                <ul className="small text-secondary mb-0 ps-3">
                                                    <li>Light: {plant.light.join(', ')}</li>
                                                    <li>Water: {plant.water_frequency}</li>
                                                    <li>Humidity: {plant.humidity}</li>
                                                    <li>Pet-safe: {plant.pet_friendly ? 'Yes' : 'No'}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-12">
                                            <div className="card border-0 shadow-sm rounded-4 p-4 text-center text-secondary">
                                                Start with your environment and let Plantiz generate a tailored shortlist.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-5 bg-success-subtle">
                    <div className="container-fluid px-5">
                        <div className="row g-4 align-items-start">
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                    <h3 className="fw-bold mb-3">Plant assistant</h3>
                                    <p className="text-secondary mb-0">Ask simple care questions and get quick guidance based on your current recommendations.</p>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm rounded-4 p-4">
                                    <div className="p-3 rounded-3 bg-light mb-3 border">
                                        <p className="mb-0">{chatReply}</p>
                                    </div>
                                    <form onSubmit={handleChatSubmit} className="d-flex gap-2 flex-wrap">
                                        <input className="form-control" placeholder="How often should I water this plant?" value={chatInput} onChange={(event) => setChatInput(event.target.value)} />
                                        <button className="btn btn-success rounded-4" type="submit" disabled={chatLoading}>{chatLoading ? 'Thinking...' : 'Ask'}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Planner;

