// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.scss";

// import { Button, Alert, Breadcrumb, Card, Form, Container, Row, Col } from 'react-bootstrap';
import { Navbar, Nav, Container, Row, Col, Form, Button } from 'react-bootstrap';

function App() {
  return (
    // <div className="body">
    <Container style={{ height: "70vh" }} className="body" fluid>
      <Header />
      <main className="main">
        <Login />
      </main>
      <Footer />
    </Container>
    // </div>
  );
}

function Login() {
  return (
    <>
      <p className="welcome" style={{padding:"0px 30px"}}>Welcome to [Insert name of Site]</p>
      <Form className="login tp" style={{padding:"0px 30px"}}>
        <Row co>
          <Col md>
            <Form.Group controlId='formEmail'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Example@email.com" />
              <Form.Text className='text-muted'>
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group controlId='formPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control type="email" placeholder="Password" />
              <Form.Text className='text-muted'>
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button size="lg" type="submit" className="mt-3" style={{width: "100%"}}>Login</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

function Header() {
  return (
    <header>
      <Navbar fixed='top' className="header">
        <Container>
          <Navbar.Brand href='#' className="basic-text">Test</Navbar.Brand>
          <Nav>
            <Nav.Link href="#" className="basic-text">Sign Up</Nav.Link>
            <Nav.Link href="#" className="basic-text">Log In</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <Navbar fixed="bottom" className='footer'>
        <Container>
          <p className="basic-text">A</p>
        </Container>
      </Navbar>
    </footer>
  )
}

// export default App;