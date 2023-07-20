import { Form, Modal, Button } from "react-bootstrap";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { create } from "../../redux/comment";

async function postComment(userId, postId, parentId, comment, token) {
    console.log(comment)
    return await fetch('http://localhost:3001/api/comments/create',
    {
        method : "POST",
        headers : {
        "Authorization" : "Bearer " + token,
        "Content-Type" : "application/json"},
        body : JSON.stringify({
        'author' : userId,
        'parent' : parentId,
        'postParent' : postId,
        'content' : comment,
        'created' : Date.now(),
        })
    });
}
  
async function addCommentToUser(userId, commentId, token) {
    return await fetch('http://localhost:3001/api/users/createComment/' + userId, {
        method : "POST",
        headers : {
        "Authorization" : "Bearer " + token,
        "Content-Type" : "application/json"
        },
        body : JSON.stringify({
        commentId : commentId
        })
    });
}

async function editComment(commentId, content, token) {
    return await fetch('http://localhost:3001/api/comments/edit/' + commentId,
    {
        method : "PUT",
        headers : {
        "Authorization" : "Bearer " + token,
        "Content-Type" : "application/json"
        },
        body : JSON.stringify({
        content : content
        })
    })
}

export function AddCommentPage({show, setShow, userId, postId, parentId, token}) {
    const dispatch = useDispatch();

    const [comment, setComment] = useState("");

    const inputHandler = (e) => {
        setComment(e.target.value);
    }

    const createComment = (e) => {
        e.preventDefault();
        postComment(userId, postId, parentId, comment, token).then(
            res => {if (res.status == 201) res.json().then(data => {
        addCommentToUser(userId, data._id, token).then(
            res => res.json()).then(newUser => {
            dispatch(create(data));
            dispatch({type : "users/updateUser", payload : newUser})
            setShow(false);
            });
        })})
    }

    
    return (
        <>
            <Modal show={show} onHide={() => {setShow(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={createComment}>
                        <Form.Group>
                            <Form.Control onChange={inputHandler}></Form.Control>
                            <Form.Text></Form.Text>
                        </Form.Group>
                        <Button type="submit">Post</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export function EditCommentPage({show, setShow, commentId, token, prevComment}) {
    const dispatch = useDispatch();

    const [comment, setComment] = useState(prevComment);

    const editCommentButton = (e) => {
        e.preventDefault();
        editComment(commentId, comment, token).then(res => res.json()).then(data => {
            dispatch({type : "comments/update", payload : data});
            setShow(false);
        })
    }


    return (
        <>
            <Modal show={show} onHide={() => {setShow(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit your comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editCommentButton}>
                        <Form.Group>
                            <Form.Control value={comment} onChange={e => setComment(e.target.value)}></Form.Control>
                            <Form.Text></Form.Text>
                        </Form.Group>
                        <Button type="submit">Post</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}