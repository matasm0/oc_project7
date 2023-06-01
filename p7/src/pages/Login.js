// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.scss";

// import { Button, Alert, Breadcrumb, Card, Form, Container, Row, Col } from 'react-bootstrap';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Header, Footer } from "../components/basic";

function Entry() {
  return (
    // <div className="body">
    <Container style={{ height: "100vh" }} className="body" fluid>
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
            <Link to={"/home"}>
                <Button size="lg" type="submit" className="mt-3 login-button" style={{width: "100%"}}>Login</Button>
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}

function SubmitButton(signIn=false) {

}

export default Entry;