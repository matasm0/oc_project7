// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.scss";

// import { Button, Alert, Breadcrumb, Card, Form, Container, Row, Col } from 'react-bootstrap';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header, Footer } from "../components/basic";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/user";

function Entry(props) {

    return (
        // <div className="body">
        <Container style={{ height: "100vh" }} className="body" fluid>
            <Header />
            <main className="main">
                <Login {...props}/>
            </main>
            <Footer />
        </Container>
        // </div>
    );
}

function Login({ isLogin }) {
    const navigate = useNavigate();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    
    const loginSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/auth/login', 
        {
            method : "POST",
            headers : {"Accept" : "application/json", "Content-Type" : "application/json"},
            body : JSON.stringify({
                'email' : email,
                'password' : password
            })
        }).then(res => {
            if (res.status == 200) res.json().then(data => {
                // dispatch(login(data.userId));
                dispatch({type: "users/login", payload: data})
                navigate("/home");
            })
        }).catch(error => {
            // do sumn
        })
    }

    const dispatch = useDispatch();

    const signupSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/auth/signup', 
        {
            method : "POST",
            headers : {"Accept" : "application/json", "Content-Type" : "application/json"},
            body : JSON.stringify({
                'email' : email,
                'password' : password
            })
        }).then(res => {
            if (res.status == 200) {
                fetch('http://localhost:3001/api/auth/login', 
                {
                    method : "POST",
                    headers : {"Accept" : "application/json", "Content-Type" : "application/json"},
                    body : JSON.stringify({
                        'email' : email,
                        'password' : password
                    })
                }).then(res => {
                    if (res.status == 200) res.json().then(data => {
                        console.log(data);
                        dispatch({type: "users/login", payload: data});
                        navigate("/home");
                    })
                })
            }
        })
    }

    const inputHandler = (e) => {
        switch(e.target.type) {
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
        }
    }

    return (
        <>
            <p className="welcome" style={{ padding: "0px 30px" }}>Welcome to [Insert name of Site]</p>
            <Form className="login tp" style={{ padding: "0px 30px" }} onSubmit={isLogin ? loginSubmit : signupSubmit}>
                <Row>
                    <Col md>
                        <Form.Group controlId='formEmail'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Example@email.com" onChange={inputHandler}/>
                            <Form.Text className='text-muted'>
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group controlId='formPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={inputHandler}/>
                            <Form.Text className='text-muted'>
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button size="lg" type="submit" className="mt-3 login-button" style={{ width: "100%" }}>{isLogin ? "Login" : "Signup"}</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

function SubmitButton(signIn = false) {

}

export default Entry;