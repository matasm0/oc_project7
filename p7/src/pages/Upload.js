import { Form, Row, Col, Container, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { create } from "../redux/post"
import { useState } from "react"

function Upload() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);
    const userId = useSelector(state => state.user.currentUser.id);

    const upload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("userId", userId);
        formData.append("image", file);
        fetch('http://localhost:3001/api/posts/create',
        {
            method : "POST",
            // headers : {"Content-Type" : "application/json"},
            body : formData
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
                            <Form.Control placeholder="title" onChange={e => setTitle(e.target.value)}/>
                            <Form.Text></Form.Text>
                        </Form.Group>
                        <Form.Group controlId="postImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={e => setFile(e.target.files[0])}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Link to={"/home"}><Button>Cancel</Button></Link>
                <Button type="submit">Submit</Button>
            </Form>
        </>
    )
} 

// DOING Finish multer

export default Upload;