import { Navbar, Nav, Container, Form, Image } from 'react-bootstrap';
import { Link } from "react-router-dom";

import { useSelector } from 'react-redux';

export function Header({currentPage}) {
  const pfp = useSelector(state => state.users.currentUser.pfp);
  const userId = useSelector(state=>state.users.currentUser._id);
  
  const logo = <Navbar.Brand className='basic-link'><Link to={'/home'}>Test</Link></Navbar.Brand>;

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
          <div className='rhs'>
            <Link to={"/upload"}>Upload</Link>
            <Link to={userId ? "/user/" + userId : ""}>
              <Image src={pfp ? pfp : require("../imgs/pfp.png")} className='pfp' roundedCircle/>
            </Link>
          </div>
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