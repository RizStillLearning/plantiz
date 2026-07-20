import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <BsNavbar expand="md" className="plantiz-navbar" variant="dark" sticky="top">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-flower1 me-2" />
          Plantiz
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/recommend">
              Get Recommendations
            </Nav.Link>
            <Nav.Link as={NavLink} to="/identify">
              Identify a Plant
            </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}

export default Navbar
