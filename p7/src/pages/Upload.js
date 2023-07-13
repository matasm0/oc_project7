import "../style/Upload.scss"

import { Form, Row, Col, Container, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { createPost } from "../redux/post"
import { useState, useEffect } from "react"
import { Footer, Header } from "../components/basic"

async function postPost (formData, userToken) {
    return await fetch('http://localhost:3001/api/posts/create',
    {
        method : "POST",
        headers : {
            "Authorization" : 'Bearer ' + userToken,
        },
        body : formData
    })
}

async function addPostToUser (postId, userId, userToken) {
    return await fetch('http://localhost:3001/api/users/createPost/' + userId, {
        method : "POST",
        headers : {
            "Authorization" : "Bearer " + userToken,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            postId : postId
        })
    });
}


// New thought, we have a new thing in our posts slice that is like "creating" or something.
// When we press create post, it sends all of the form data into the store. It then dispatches
// the fetch, and the creation of the post status is updated. This page then watches that, and once its
// fulfilled, it will navigate off the page. When this module is unloaded, it should clear creating.
function Upload() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [fileUrl, setFileUrl] = useState("");
 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);
    const userId = useSelector(state => state.users.currentUser._id);
    const userToken = useSelector(state => state.users.currentUser.token);

    const upload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("userId", userId);
        formData.append("image", file);
        formData.append("created", Date.now())
        postPost(formData, userToken).then((res) => res.json()).then(data => {
        addPostToUser(data['post']['_id'], userId, userToken).then(res => res.json()).then(newUser => {
            dispatch(createPost(data['post']));
            dispatch({type : "users/updateUser", payload : newUser});
            navigate("/home");
        });
        });
    }

    const imageInputHandler = (e) => {
        setFile(e.target.files[0]);
    }

    useEffect(()=>()=>{
        URL.revokeObjectURL(fileUrl);
    }, [])

    useEffect(() => {
        if (file) setFileUrl(URL.createObjectURL(file));
    }, [file])

    return (
        <div className="upload-page">
            <Header currentPage={"home"}/>
            <Container>
                <Form onSubmit={upload}>
                    <Row>
                        <Col md>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Post Title</Form.Label>
                                <Form.Control placeholder="title" onChange={e => setTitle(e.target.value)}/>
                                <Form.Text></Form.Text>
                            </Form.Group>
                            <img src={fileUrl}></img>
                            <Form.Group controlId="postImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={imageInputHandler}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Link to={"/home"}><Button>Cancel</Button></Link>
                    <Button type="submit">Submit</Button>
                </Form>
            </Container>
            <Footer/>
        </div>
    )
} 

export default Upload;