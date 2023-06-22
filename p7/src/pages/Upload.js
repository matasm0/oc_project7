import { Form, Row, Col, Container, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
// import { create } from "../components/redux/post"

function Upload() {
    let title = ""

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
        })
    }

    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);

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
                {/* <Button onClick={(e) => {dispatch(addTodo())}}>TEST</Button> */}
                <Button onClick={(e) => {console.log(posts)}}>TEST</Button>
                <Button type="submit">Submit</Button>
            </Form>
        </>
    )
} 

export default Upload;