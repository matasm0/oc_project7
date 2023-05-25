// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.scss";

// import { Button, Alert, Breadcrumb, Card, Form, Container, Row, Col } from 'react-bootstrap';
import { Navbar, Nav, Container, Row, Col, Form, Button } from 'react-bootstrap';

function App() {
  return (
    // <div className="body">
      <Container style={{height:"70vh"}} className="body" fluid>
        <Header />
          <main className="main">
            <Login />
          </main>
        <Footer />
      </Container>
    // </div>
  );
}

function Login () {
  return (
    <>
      <p className="welcome">Welcome to [Insert name of Site]</p>
      <Form className="login">
        <Row>
          <Col md>
            <Form.Group controlId='formEmail'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Example@email.com" />
              <Form.Text className='text-muted'>
              </Form.Text>
            </Form.Group>        
          </Col>
          <Col md>
            <Form.Group controlId='formEmail'>
              <Form.Label>Password</Form.Label>
              <Form.Control type="email" placeholder="Password" />
              <Form.Text className='text-muted'>
              </Form.Text>
            </Form.Group>        
          </Col>
        </Row>
        <Button type="submit">Login</Button>
      </Form>
    </>
  );
}

function Header() {
  return (
    <header classname="header">
      <Navbar fixed='top' variant='dark' bg='dark'>
        <Container>
          <Navbar.Brand href='#'>Test</Navbar.Brand>
          <Nav>
            <Nav.Link href="#">Sign Up</Nav.Link>
            <Nav.Link href="#">Log In</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

function Footer() {
  return (
    <footer className='footer'>
      <Navbar fixed="bottom" bg='dark'>
        <Container>
          <p style={{color:"white"}}>A</p>
        </Container>
      </Navbar>
    </footer>
  )
}

export default App;