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
            {/* <Nav.Link href="#" className="basic-text">Sign Up</Nav.Link>
            <Nav.Link href="#" className="basic-text">Log In</Nav.Link> */}
            <Link to={"/"} className="basic-link">Sign Up</Link>
            <Link to={"/"} className="basic-link">Log In</Link>
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