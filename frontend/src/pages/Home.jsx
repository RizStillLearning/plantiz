import { Link } from 'react-router-dom'

function Home() {
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
                    <div className="ms-auto" id="navbarSupportedContent">
                        <Link to="/login" className="btn btn-outline-success fs-4 me-2 rounded-4 px-3">Login</Link>
                        <Link to="/signup" className="btn btn-success fs-4 rounded-4 px-3">Sign Up</Link>
                    </div>
                </nav>
            </header>

            <main>
                <section className="hero-section px-5 py-5">
                    <div className="container-fluid">
                        <div className="row align-items-center gy-5">
                            <div className="col-lg-6">
                                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 mb-3 fw-semibold">
                                    <i className="bi bi-stars me-1"></i> Smart Plant Recommendations
                                </span>
                                <h1 className="display-4 fw-bold mb-3">
                                    Find &amp; Identify Your <span className="text-success">Perfect Plant</span>
                                </h1>
                                <p className="lead text-secondary mb-4">
                                    Discover plant recommendations and care guidance tuned to your environment. The planner page helps you match plants to your space without guesswork.
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    <Link to="/login" className="btn btn-outline-success fs-4 me-2 rounded-4 px-3">Get Started <i class="bi bi-arrow-right"></i></Link>
                                </div>
                                <div className="d-flex gap-4 mt-5">
                                    <div>
                                        <h3 className="fw-bold text-success mb-0">10k+</h3>
                                        <small className="text-secondary">Plants identified</small>
                                    </div>
                                    <div>
                                        <h3 className="fw-bold text-success mb-0">500+</h3>
                                        <small className="text-secondary">Species catalogued</small>
                                    </div>
                                    <div>
                                        <h3 className="fw-bold text-success mb-0">4.8★</h3>
                                        <small className="text-secondary">User rating</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="hero-visual d-flex align-items-center justify-content-center">
                                    <i className="bi bi-flower3 hero-icon"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 bg-white" id="about">
                    <div className="container-fluid px-5">
                        <div className="text-center mx-auto mb-5 section-intro">
                            <h2 className="fw-bold mb-3">What is Plantiz?</h2>
                            <p className="text-secondary">
                                Plantiz is a plant recommendation and identification platform built for plant lovers of every level.
                                Whether you're picking your first houseplant or expanding an indoor jungle, we take the guesswork
                                out of choosing, finding, and caring for plants.
                            </p>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 rounded-4 border-0 shadow-sm text-center">
                                    <div className="feature-icon bg-success-subtle text-success rounded-circle mx-auto mb-3">
                                        <i className="bi bi-camera fs-3"></i>
                                    </div>
                                    <h5 className="fw-bold">Instant Identification</h5>
                                    <p className="text-secondary mb-0">Upload a photo and Plantiz identifies the species in seconds, complete with care details.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 rounded-4 border-0 shadow-sm text-center">
                                    <div className="feature-icon bg-success-subtle text-success rounded-circle mx-auto mb-3">
                                        <i className="bi bi-sliders fs-3"></i>
                                    </div>
                                    <h5 className="fw-bold">Personalized Recommendations</h5>
                                    <p className="text-secondary mb-0">Tell us your light, space, and experience level — we'll match you with plants that will actually thrive.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 rounded-4 border-0 shadow-sm text-center">
                                    <div className="feature-icon bg-success-subtle text-success rounded-circle mx-auto mb-3">
                                        <i className="bi bi-droplet-half fs-3"></i>
                                    </div>
                                    <h5 className="fw-bold">Care Guidance</h5>
                                    <p className="text-secondary mb-0">Get watering, light, and humidity tips tailored to every plant in your collection.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 bg-success-subtle" id="how-it-works">
                    <div className="container-fluid px-5">
                        <h2 className="fw-bold text-center mb-5">How It Works</h2>
                        <div className="row g-4">
                            <div className="col-md-4 text-center">
                                <div className="step-number mx-auto mb-3">1</div>
                                <h5 className="fw-bold">Tell Us About Your Space</h5>
                                <p className="text-secondary">Share your light levels, humidity, and experience so we can tailor suggestions to you.</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <div className="step-number mx-auto mb-3">2</div>
                                <h5 className="fw-bold">Get Matched</h5>
                                <p className="text-secondary">Our engine recommends plants that will actually thrive where you live.</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <div className="step-number mx-auto mb-3">3</div>
                                <h5 className="fw-bold">Grow With Confidence</h5>
                                <p className="text-secondary">Follow tailored care tips and watch your new plant flourish.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5">
                    <div className="container-fluid px-5">
                        <div className="cta-banner rounded-4 p-5 text-center text-white">
                            <h2 className="fw-bold mb-3">Ready to discover the right plant for your space?</h2>
                            <p className="mb-4 opacity-75">Use the planner page to get tailored recommendations for your home.</p>
                            <Link to="/planner" className="btn btn-light btn-lg rounded-4 px-5 fw-semibold text-success">Open the planner</Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-dark text-light-emphasis py-4">
                <div className="container-fluid px-5 d-flex flex-wrap gap-3 justify-content-between align-items-center">
                    <span className="d-flex align-items-center gap-2 fw-semibold">
                        <i className="bi bi-leaf-fill text-success"></i> Plantiz
                    </span>
                    <span className="text-secondary small">&copy; 2026 Plantiz. All rights reserved.</span>
                    <div className="d-flex gap-3 fs-5">
                        <i className="bi bi-instagram"></i>
                        <i className="bi bi-twitter-x"></i>
                        <i className="bi bi-facebook"></i>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Home;
