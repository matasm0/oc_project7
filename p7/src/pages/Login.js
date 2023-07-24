import "../style/App.scss";

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Header, Footer, ErrorModal } from "../components/basic";
import { useState } from "react";

import { useDispatch } from "react-redux";

function Entry(props) {

    return (
        <div className="loginHolder">
            <Header />
            <Container className="body" fluid>
                <main className="main">
                    <Login {...props}/>
                </main>
            </Container>
            <Footer />
        </div>
    );
}

function Login({ isLogin }) {
    const navigate = useNavigate();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ showError, setShowError ] = useState(false);
    const [ error, setError ] = useState("");
    
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
        }).then(res => res.json().then(data => {
            if (res.status == 200) {
                // dispatch(login(data.userId));
                dispatch({type: "users/login", payload: data})
                navigate("/home");
            }
            else {
                setError(data['error']);
                setShowError(true);
            }
        })).catch(error => {
            setError(error.message);
            setShowError(true);
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
        }).then(res => res.json().then(temp => {
            if (res.status == 201) {
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
                        navigate("/user/setup");
                    })
                })
            }
            else {
                setShowError(true);
                setError(temp['error']);
            }
        })).catch(error => {
            setShowError(true);
            setError(error.message);
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
            <ErrorModal {...{show : showError, setShow : setShowError, error : error}}/>
            <p className="welcome" style={{ padding: "0px 30px" }}>Welcome {isLogin && " back "}to [Connect]</p>
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

export default Entry;