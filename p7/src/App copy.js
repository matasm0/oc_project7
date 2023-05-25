import logo from './logo.svg';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.scss"

import { Button, Alert, Breadcrumb, Card, Form, Container, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Container fluid='false'>
          <Form>
            <Row>
              <Col md>
                <Form.Group controlId='formEmail'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Example@email.com" />
                  <Form.Text className='text-muted'>
                    We'll never save your email address, trust us!
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md>
                <Form.Group controlId='formPassword'>
                    <Form.Label>formPassword</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
              </Col>
            </Row>
            <Button variant='secondary' href='./ttt.js'>Login</Button>
          </Form>

          <Card className='mb-3 mt-3' style={{color: "black"}}>
            <Card.Img></Card.Img>
            <Card.Body>
              <Card.Title>Card Example</Card.Title>
              <Card.Text>This is an example of react boostrap cards</Card.Text>
              <Button variant='primary'>Read More</Button>
            </Card.Body>
          </Card>
          <Breadcrumb>
            <Breadcrumb.Item>Test 1</Breadcrumb.Item>
            <Breadcrumb.Item>Test 2</Breadcrumb.Item>
            <Breadcrumb.Item>Test 3</Breadcrumb.Item>
          </Breadcrumb>
          <Alert variant='primary'>This is a button</Alert>
          <Button>Test Button</Button>
        </Container>
      </header>
    </div>
  );
}

export default App;
