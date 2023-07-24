import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { Navbar, Nav, Container, Form, Image, Button, Modal } from 'react-bootstrap';
import { logout } from '../redux/actions';

export function Header({currentPage}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pfp = useSelector(state => state.users.currentUser.pfp);
  const userId = useSelector(state=>state.users.currentUser.id);
  
  const logo = <Navbar.Brand className='basic-link'><Link to={'/home'}>Connect</Link></Navbar.Brand>;

  let body = "";

  const logoutButton = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login");
  }

  switch (currentPage) {
    case "home":
      body =
        <Container>
          {logo}
          <div className='rhs'>
            <Link to={"/upload"} className='basic-link'>Upload</Link>
            <Link onClick={logoutButton} className='basic-link'>Logout</Link>
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
          <p className="basic-text">Copyright 2023 GroupMania</p>
        </Container>
      </Navbar>
    </footer>
  )
}

export function ErrorModal({show, setShow, error}) {
  return (
    <Modal show={show} onHide={() => {setShow(false)}}>
      <Modal.Header closeButton>
        <Modal.Body>
          <p>{error}</p>
        </Modal.Body>
      </Modal.Header>
    </Modal>
  )
}