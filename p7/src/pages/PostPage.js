import { useParams } from "react-router-dom";
import { likeStatus } from "../redux/user";
import { Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getCommentsPost, create } from "../redux/comment";
import { getPostById } from "../redux/post";

// on unmount clear comments?
function PostPage () {
  const { postId } =  useParams();
  // const temp = useSelector(state => likeStatus(state, postId));

  const [comment, setComment] = useState("");

  const userId = useSelector(state => state.user.id);
  const dispatch = useDispatch();
  dispatch(getPostById('1234'))
  // console.log(userId); 

  const inputHandler = (e) => {
    setComment(e.target.value);
  }
  
  // fetch('http://localhost:3001/api/posts/comments/649468bbcb5e0580a694f648').then(res => res.json()).then(
  //   data => {console.log(data);}
  // )



  const postComment = (e) => {
    e.preventDefault();
    // Move to a dispatch
    fetch('http://localhost:3001/api/comments/create',
    {
      method: "POST",
      headers : {"Accept" : "application/json", "Content-Type" : "application/json"},
      body : JSON.stringify({
        'author' : userId,
        'parent' : "root",
        'postParent' : postId,
        'content' : comment
      })
    }).then(res => {if (res.status == 201) res.json().then(data => {
      dispatch(create(data));
    })})
  }
  // useEffect(() => {})
  // do fetch on postID
  return (
    <>
      <img src={require("../imgs/DATBOI.jpg")} />
      <p>Dat boi</p>
      <Form onSubmit={postComment}>
        <Form.Group>
          <Form.Control placeholder="commment" onChange={inputHandler}></Form.Control>
          <Form.Text></Form.Text>
        </Form.Group>
        <Button type="submit">Post</Button>
      </Form>
      <Comments/>
    </>
  ); 
}

function Comments() {
  const { postId } =  useParams();
  const userId = useSelector(state => state.user.id);
  const commentState = useSelector(state => state.comments.state);
  const commentsList = useSelector(state => state.comments.list);
  const dispatch = useDispatch();
  useEffect(() => {
    if (commentState === "initial") {
      dispatch(getCommentsPost({postId : postId}))
    }
  }, [commentState, dispatch, commentsList]);

  let commentObjects;
  if (commentState === "loaded") {
    commentObjects = commentsList.map(comment => {
      return <Comment key={comment._id} {...comment}/>
    })
  }

  return (
    <>
      {commentObjects}
    </>
  )
}

function Comment(comment) {
  const content = comment.content;
  return (
    <p>{content}</p>
  )

}

export default PostPage;