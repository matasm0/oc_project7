import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header>
      <Navbar fixed='top' className="header">
        <Container>
          {/* <Navbar.Brand prefix={'logo'} href='/' className="basic-link">Test</Navbar.Brand> */}
          <Navbar.Brand className='basic-link'><Link to={'/'}>Test</Link></Navbar.Brand>
          <Nav>
            <Nav.Link href="#" className="basic-link">Sign Up</Nav.Link>
            <Nav.Link href="/login" className="basic-link">Log In</Nav.Link>
            <Link to={"/signup"} className="basic-link">Sign Up</Link>
            <Link to={"/login"} className="basic-link">Log In</Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <Navbar fixed='bottom' className='footer'>
        <Container>
          <p className="basic-text">A</p>
        </Container>
      </Navbar>
    </footer>
  )
}