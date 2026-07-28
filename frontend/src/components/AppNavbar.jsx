import { Link, NavLink, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
    { to: '/planner', label: 'Plant recommender' },
    { to: '/classify', label: 'Plant classification' },
    { to: '/chatbot', label: 'Chatbot' },
]

function AppNavbar() {
    const navigate = useNavigate()

    function handleSignOut() {
        navigate('/login')
    }

    return (
        <header className="home-navbar">
            <nav className="navbar navbar-expand-lg bg-success-subtle px-5">
                <Link to="/" className="navbar-brand text-success fs-1 fw-bold d-flex flex-row align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="40" fill="currentColor" className="bi bi-leaf-fill" viewBox="0 0 16 16">
                        <path d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z" />
                    </svg>
                    Plantiz
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto me-2 mb-2 mb-lg-0">
                        {NAV_LINKS.map((link) => (
                            <li className="nav-item" key={link.to}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => `nav-link text-success${isActive ? ' fw-bold' : ''}`}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="ms-auto">
                    <button type="button" className="btn btn-outline-danger rounded-4 fs-5 ms-5" onClick={handleSignOut}>
                        Sign out <i class="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default AppNavbar
