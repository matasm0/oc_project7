import { Navbar, Nav, Container, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

export function Header({currentPage}) {
  
  const logo = <Navbar.Brand className='basic-link'><Link to={'/'}>Test</Link></Navbar.Brand>;

  let body = "";

  switch (currentPage) {
    case "home":
      body =
        <Container>
          {logo}
          <Form>
            <Form.Control placeholder='Search'></Form.Control>
            <Form.Text></Form.Text>
          </Form>
          <Link to={"/upload"}>Upload</Link>
        </Container>
      break;
    default:
      body = 
       <Container>
          {/* <Navbar.Brand prefix={'logo'} href='/' className="basic-link">Test</Navbar.Brand> */}
          {logo}
          <Nav>
            <Link to={"/signup"} className="basic-link">Sign Up</Link>
            <Link to={"/login"} className="basic-link">Log In</Link>
          </Nav>
        </Container>
  } 

  return (
    <header>
      <Navbar className="header">
        {body}
      </Navbar>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <Navbar className='footer'>
        <Container>
          <p className="basic-text">A</p>
        </Container>
      </Navbar>
    </footer>
  )
}