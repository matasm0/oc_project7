import { useParams } from "react-router-dom";
import { likeStatus, findUser } from "../redux/user";
import { Form, Button, Card, Row, Col, Container } from "react-bootstrap";
import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getCommentsPost, getCommentsChildren, create } from "../redux/comment";
import { getPostById } from "../redux/post";

function PostPage () {
  const { postId } =  useParams();
  // const temp = useSelector(state => likeStatus(state, postId));

  const [comment, setComment] = useState("");

  const userId = useSelector(state => state.user.currentUser.id);
  const dispatch = useDispatch();

  const post = useSelector(state => state.posts.current);
  const postState = useSelector(state => state.posts.currentState);
  
  // Better way to do this?
  const usersDict = useSelector(state => state.user.dict);
  let author = "";
  let postImage;

  // Unload post on Unmount
  useEffect(() => () => {
    dispatch({type : "posts/unload"});
    dispatch({type : "comments/unload"});
  }, []);

  let postName = "";
  useEffect(() => {
    if (postState === 'unloaded') {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postState]);

  if (postState === 'loaded') {
    postName = post['title'];
    author = usersDict[post.userId];
    postImage = <img src={post.imageUrl}/>
  }
  
  

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
      {/* <img src={require("../imgs/DATBOI.jpg")} /> */}
      {postImage}
      <p>{postName} posted by {author.email}</p>
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
  const userId = useSelector(state => state.user.currentUser.id);
  const commentState = useSelector(state => state.comments.state);
  const commentsList = useSelector(state => getCommentsChildren(state, "root"));
  const dispatch = useDispatch();
  useEffect(() => {
    if (commentState === "initial") {
      dispatch(getCommentsPost({postId : postId}))
    }
  }, [commentState, dispatch, commentsList]);


  // We probably load all comments at once, so find only the comments that are root
  let commentObjects;
  if (commentState === "loaded") {
    commentObjects = commentsList.map(comment => {
      return <Comment key={comment._id} {...{comment : comment}}/>
    })
  }

  return (
    <>
      {commentObjects}
    </>
  )
}

// Have a user store with a dictionary of users that contains usernames and pfps mayhaps
function Comment({comment, _maxLevel = 1}) {
  const { postId } =  useParams();
  const userId = useSelector(state => state.user.currentUser.id);
  const user = useSelector(state => findUser(state, userId));
  const dispatch = useDispatch();
  const content = comment.content;

  const [newComment, setComment] = useState("");

  const inputHandler = (e) => {
    setComment(e.target.value);
  }

  const addNewComment = (e) => {
    fetch('http://localhost:3001/api/comments/create',
    {
      method: "POST",
      headers : {"Accept" : "application/json", "Content-Type" : "application/json"},
      body : JSON.stringify({
        'author' : userId,
        'parent' : comment._id,
        'postParent' : postId,
        'content' : newComment
      })
    }).then(res => {if (res.status == 201) res.json().then(data => {
      dispatch(create(data));
    })})
  }

  // maxLevel for how many levels of comments to get. 0 means just the comment itself. 2 is default
  // Pull 5 comments per level
  const childrenList = useSelector(state => getCommentsChildren(state, comment._id));
  let childrenObjects = [];

  const [numShownComments, setNumComments] = useState(_maxLevel == 0 ? 0 : Math.min(childrenList.length, 5));
  const [maxLevel, setMaxLevel] = useState(_maxLevel);

  if (maxLevel > 0) {
    for (let i = 0; i < numShownComments; i++) {
      childrenObjects.push(<Comment key={childrenList[i]._id} {...{comment : childrenList[i], _maxLevel : maxLevel - 1}}/>)
    }
  }

  const expandComments = (e) => {
    if (maxLevel == 0) setMaxLevel(1);
    setNumComments(Math.min(numShownComments + 3, childrenList.length));
  }

  let expandButton;
  if (numShownComments < childrenList.length) {
    expandButton = <Button onClick={expandComments}>More Comments</Button>
  }

  return (
    <Container>
      <Card>
        <Card.Header>Author: {user.email}</Card.Header>
        <Card.Body>
          <Card.Text>
            {content}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Form>
            <Row>
              <Col> 
                <Form.Control placeholder="Add a comment" onChange={inputHandler}></Form.Control>
                <Form.Text></Form.Text>
              </Col>
              <Col><Button onClick={addNewComment}>E</Button></Col>
              {expandButton}
            </Row>
          </Form>
        </Card.Footer>
      </Card>
      {childrenObjects}
    </Container>
  )

}

export default PostPage;