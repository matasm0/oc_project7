import { useNavigate, useParams } from "react-router-dom";
import { likeStatus, findUser } from "../redux/user";
import { Form, Button, Card, Row, Col, Container } from "react-bootstrap";
import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getCommentsPost, getCommentsChildren, create } from "../redux/comment";
import { getPostById } from "../redux/post";
import { addLikeDislikeComment } from "../redux/actions";

import { readPost } from "../redux/user";

// Maybe have postpage collect all of the info (user and post) and send them down to its children
function PostPage () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { postId } =  useParams();
  // const temp = useSelector(state => likeStatus(state, postId));

  const [comment, setComment] = useState("");

  const userId = useSelector(state => state.users.currentUser._id);
  const token = useSelector(state => state.users.currentUser.token);
  

  const post = useSelector(state => state.posts.current);
  const postState = useSelector(state => state.posts.currentState);
  const postAuthorId = useSelector(state => state.posts.current.userId);
  
  // Better way to do this?
  const usersDict = useSelector(state => state.users.dict);
  // This is stupid. Don't show anything while loading, then just pull from loaded post.
  let author = "";
  let postImage;

  // Unload post on Unmount
  useEffect(() => () => {
    dispatch({type : "posts/unload"});
    dispatch({type : "comments/unload"});
  }, []);

  // Add post to read on mount
  // IF THE POST HAS BEEN READ DO NOT RUN THIS. THAT IS STUPID
  // I think that means we have to run this when the post loads.
  useEffect(() => {
    dispatch(readPost({user : userId, post : postId}));
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

  const deletePost = (e) => {
    fetch('http://localhost:3001/api/posts/delete/' + postId,
    {
      method : "DELETE",
      headers : {
        "Authorization" : "Bearer " + token
      },
    }).then(e => {
      fetch('http://localhost:3001/api/users/deletePost/' + userId, {
        method : "DELETE",
        headers : {
          "Authorization" : "Bearer " + token,
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          postId : postId
        })
      }).then(res => res.json()).then(newUser => {
        dispatch({type : "posts/remove", payload : postId})
        dispatch({type : "users/updateUser", payload : newUser})
        navigate("/home");
      })
    })
  }

  const postComment = (e) => {
    e.preventDefault();
    // Move to a dispatch
    fetch('http://localhost:3001/api/comments/create',
    {
      method : "POST",
      headers : {
        "Authorization" : "Bearer " + token,
        "Accept" : "application/json", 
        "Content-Type" : "application/json"},
      body : JSON.stringify({
        'author' : userId,
        'parent' : "root",
        'postParent' : postId,
        'content' : comment,
        'created' : Date.now(),
      })
    }).then(res => {if (res.status == 201) res.json().then(data => {
      fetch('http://localhost:3001/api/users/createComment/' + userId, {
        method : "POST",
        headers : {
          "Authorization" : "Bearer " + token,
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          commentId : data['comment']['_id']
        })
      }).then(res => res.json()).then(newUser => {
        dispatch(create(data['comment']));
        dispatch({type : "users/updateUser", payload : newUser})
      });
    })})
  }

  // do fetch on postID
  return (
    <>
      {/* <img src={require("../imgs/DATBOI.jpg")} /> */}
      {postImage}
      <p>{postName} posted by {author ? author.email : ""}</p>
      <Form onSubmit={postComment}>
        <Form.Group>
          <Form.Control placeholder="commment" onChange={inputHandler}></Form.Control>
          <Form.Text></Form.Text>
        </Form.Group>
        <Button type="submit">Post</Button>
        {(postAuthorId === userId) && <Button onClick={deletePost}>Delete</Button>}
      </Form>
      <Comments/>
    </>
  ); 
}

function Comments() {
  const { postId } =  useParams();
  const userId = useSelector(state => state.users.currentUser.id);
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
  const dispatch = useDispatch();
  
  const { postId } =  useParams();
  const userId = useSelector(state => state.users.currentUser._id);
  const token = useSelector(state => state.users.currentUser.token);
  const content = comment.content;
  const authorId = comment.author;
  const author = useSelector(state => findUser(state, authorId));

  const [newComment, setComment] = useState("");

  const inputHandler = (e) => {
    setComment(e.target.value);
  }

  const addNewComment = (e) => {
    fetch('http://localhost:3001/api/comments/create',
    {
      method: "POST",
      headers : {
        "Authorization" : "Bearer " + token,
        "Accept" : "application/json",
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        'author' : userId,
        'parent' : comment._id,
        'postParent' : postId,
        'content' : newComment,
        'created' : Date.now(),
      })
    }).then(res => {if (res.status == 201) res.json().then(data => {
      dispatch(create(data['comment']));
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

  const editComment = (e) => {
    fetch('http://localhost:3001/api/comments/edit/' + comment._id,
    {
      method : "PUT",
      headers : {
        "Authorization" : "Bearer " + token,
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        content : "deez"
      })
    }).then(res => res.json()).then(data => {
      dispatch({type : "comments/update", payload : data})
    })
  }

  const deleteComment = (e) => {
    fetch('http://localhost:3001/api/comments/delete/' + comment._id,
    {
      method : "DELETE",
      headers : {
        "Authorization" : "Bearer " + token
      },
    }).then(res => res.json()).then(data => {
      dispatch ({type : "comments/update", payload : data});
    });
  }

  const likeDislike = (e) => {
    let likeStatus = e.target.value == 'like' ? 1 : -1;
    dispatch(addLikeDislikeComment({
      _id : userId
    },
    {
      _id : comment._id
    },
    likeStatus
    ))
  }

  return (
    <Container>
      <Card>
        <Card.Header>Author: {author ? author.email : ""}</Card.Header>
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
              {(author && author._id == userId) && <>
                <Col><Button onClick={editComment}>Edit</Button></Col>
                <Col><Button onClick={deleteComment}>Delete</Button></Col>
                </>
              }
              <Col><Button onClick={addNewComment}>E</Button></Col>
              <Col><Button value={"like"} onClick={likeDislike}>Like</Button></Col>
              <Col><Button value={"dislike"} onClick={likeDislike}>Dislike</Button></Col>
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