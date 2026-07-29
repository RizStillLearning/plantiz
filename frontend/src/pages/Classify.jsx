import { useEffect, useState } from 'react'
import { identifyPlant } from '../api/client'
import AppNavbar from '../components/AppNavbar'

const ORGANS = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'leaf', label: 'Leaf' },
    { value: 'flower', label: 'Flower' },
    { value: 'fruit', label: 'Fruit' },
    { value: 'bark', label: 'Bark' },
]

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png'])

function Classify() {
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [organ, setOrgan] = useState('auto')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)

    useEffect(() => {
        if (!file) {
            setPreviewUrl('')
            return
        }
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    function handleFileChange(event) {
        const selected = event.target.files?.[0] || null
        setResult(null)
        if (selected && !ALLOWED_TYPES.has(selected.type)) {
            setError('Please choose a JPEG or PNG image.')
            setFile(null)
            return
        }
        setError('')
        setFile(selected)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        if (!file) {
            setError('Choose a JPEG or PNG photo first.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const data = await identifyPlant(file, organ)
            setResult(data)
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
                        <div className="mb-4">
                            <h1 className="fw-bold mb-1">Plant classification</h1>
                            <p className="text-secondary mb-0">Upload a plant photo to identify its species and care needs.</p>
                        </div>
                        <div className="row g-4 align-items-start">
                            <div className="col-lg-5">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                    <form onSubmit={handleSubmit}>
                                        <label className="form-label fw-semibold">Plant photo</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/jpeg,image/png"
                                            onChange={handleFileChange}
                                        />
                                        <div className="form-text mb-3">JPEG or PNG. A clear photo of a leaf or flower works best.</div>

                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Selected plant preview" className="img-fluid d-block rounded-4 mb-3 border" />
                                        ) : null}

                                        <label className="form-label fw-semibold">Plant part</label>
                                        <select className="form-select mb-4" value={organ} onChange={(event) => setOrgan(event.target.value)}>
                                            {ORGANS.map((option) => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>

                                        <button className="btn btn-success w-100 rounded-4" type="submit" disabled={loading || !file}>
                                            {loading ? 'Identifying...' : 'Identify plant'}
                                        </button>
                                    </form>
                                    {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}
                                </div>
                            </div>
                            <div className="col-lg-7">
                                {result ? (
                                    <>
                                        {typeof result.remaining_requests === 'number' ? (
                                            <p className="text-secondary small mb-3">{result.remaining_requests} identifications remaining today.</p>
                                        ) : null}
                                        <div className="row g-3">
                                            {result.candidates.map((candidate, index) => (
                                                <div className="col-12" key={`${candidate.scientific_name}-${index}`}>
                                                    <div className="card border-0 shadow-sm rounded-4 p-3">
                                                        <div className="d-flex justify-content-between align-items-start gap-2">
                                                            <div>
                                                                <h5 className="fw-bold mb-1 fst-italic">{candidate.scientific_name}</h5>
                                                                <p className="text-secondary small mb-2">
                                                                    {candidate.common_names.length ? candidate.common_names.join(', ') : 'No common name on record'}
                                                                    {candidate.family ? ` · ${candidate.family}` : ''}
                                                                </p>
                                                            </div>
                                                            <span className="badge bg-success-subtle text-success">{candidate.confidence}%</span>
                                                        </div>
                                                        {candidate.local_match ? (
                                                            <div className="mt-2 pt-2 border-top">
                                                                <p className="text-secondary small mb-2">{candidate.local_match.description}</p>
                                                                <ul className="small text-secondary mb-0 ps-3">
                                                                    <li>Light: {candidate.local_match.light.join(', ')}</li>
                                                                    <li>Water: {candidate.local_match.water_frequency}</li>
                                                                    <li>Humidity: {candidate.local_match.humidity}</li>
                                                                    <li>Pet-safe: {candidate.local_match.pet_friendly ? 'Yes' : 'No'}</li>
                                                                </ul>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center text-secondary">
                                        Upload a photo to see species candidates and care details.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Classify
