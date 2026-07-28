import { useEffect, useMemo, useState } from 'react'
import { getRecommendations } from '../api/client'
import AppNavbar from '../components/AppNavbar'

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
    const [form, setForm] = useState(defaultForm)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
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

    return (
        <>
            <AppNavbar />
            <main>
                <section className="py-5 bg-white">
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
            </main>
        </>
    )
}

export default Planner
