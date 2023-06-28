import { Form, Row, Col, Container, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { create } from "../redux/post"

function Upload() {
    let title = ""

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);

    const inputHandler = (e) => {
        title = e.target.value;
    }

    const upload = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/posts/create',
        {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                'title' : title,
            })
        }).then((res) => res.json()).then(data => {
            dispatch(create(data['post']))
            navigate("/home");
        });
        
    }

    return (
        <>
            <Form onSubmit={upload}>
                <Row>
                    <Col md>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Post Title</Form.Label>
                            <Form.Control placeholder="title" onChange={inputHandler}/>
                            <Form.Text></Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Link to={"/home"}><Button>Cancel</Button></Link>
                <Button type="submit">Submit</Button>
            </Form>
        </>
    )
} 

export default Upload;