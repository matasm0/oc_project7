import "../style/PostPage.scss";
import { Header, Footer } from "../components/basic";

import { useNavigate, useParams } from "react-router-dom";
import { likeStatus, findUser } from "../redux/user";
import { Form, Button, Card, Row, Col, Container, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getComments, getCommentsChildren, create } from "../redux/comment";
import { getPostById } from "../redux/post";
import { addLikeDislikeComment, addLikeDislikePost } from "../redux/actions";

import { readPost } from "../redux/user";

import { PostInfo, CommentInfo } from "../redux/actions";
import { AddCommentPage, EditCommentPage } from "../components/comments/commentsComponents";

async function deleteComment(commentId, token) {
  return await fetch('http://localhost:3001/api/comments/delete/' + commentId,
  {
    method : "DELETE",
    headers : {
      "Authorization" : "Bearer " + token
    },
  })
}

async function deletePost(postId, token) {
  return await fetch('http://localhost:3001/api/posts/delete/' + postId,
  {
    method : "DELETE",
    headers : {
      "Authorization" : "Bearer " + token
    },
  });
}

async function deletePostFromUser(userId, postId, token) {
  return await fetch('http://localhost:3001/api/users/deletePost/' + userId, {
    method : "DELETE",
    headers : {
      "Authorization" : "Bearer " + token,
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({
      postId : postId
    })
  });
}

function PostPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const options = {month : "numeric", day : "numeric", year : "numeric", hour : '2-digit', minute : '2-digit'}

  let { postId } =  useParams();
  postId = Number(postId);

  const { author, post } = PostInfo(postId); 
  const createdTime = new Date(post.created); 

  const [makeComment, setMakeComment] = useState(false);

  const userId = useSelector(state => state.users.currentUser.id);
  const token = useSelector(state => state.users.currentUser.token);

  const isLiked = useSelector(state => likeStatus(state, postId));
  const isDeleted = post.likes == -1;

  // Unload post on Unmount
  useEffect(() => () => {
    dispatch({type : "posts/unload"});
    dispatch({type : "comments/unload"});
  }, []);

  // Add post to read on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(readPost({user : userId, post : postId}));
  }, []);

  useEffect(() => {
    if (post.status === 'unloaded') {
      dispatch(getPostById(postId));
    }
  }, [dispatch, post.status]);

  if (post.status === "missing") {
    return <div>Post Does Not Exist</div>
  }

  const deletePostButton = (e) => {
    deletePost(postId, token).then(e => {
    deletePostFromUser(userId, postId, token).then(
      res => res.json()).then(newUser => {
        dispatch({type : "posts/remove", payload : postId})
        dispatch({type : "users/updateUser", payload : newUser})
        navigate("/home");
      })
    })
  }

  const likeDislike = (e) => {
    let likeStatus = e.target.value === 'like' ? 1 : -1;
    dispatch(addLikeDislikePost({
        id: userId
    },
    {
        id : postId
    },
    likeStatus
    ))
  }

  // We would love temporary loading objects
  // FIX fill with temporaries
  let postObjects = {
    title : "",
    author : "",
    time : "",
    image : "",
    content : "",
    commentForm : "",
  };

  // BUILDING WITH LEGOS
  // FIX I am using temporary html elements, change to better react ones
  if (post.status === 'loaded') {
    postObjects.title = <h1>{isDeleted ? "[Post has been deleted]" : post.title}</h1>
    postObjects.author = 
    !isDeleted ? 
    <div className="author-info">
      <h3>posted by</h3>
      <Image src={author.pfp || require("../imgs/pfp.png")} roundedCircle className="pfp"/>
      <h3><b>{author.username}</b></h3>
      <p>{createdTime.toLocaleString(navigator.language, options)}</p>
    </div> :
    <div className="author-info">
      <h3>posted by</h3>
      <Image src={require("../imgs/pfp.png")} roundedCircle className="pfp"/>
    </div>


    postObjects.image = <img className="post-img" src={post.image}/>;
    
    postObjects.content = 
    <Container className="post-content">
      {postObjects.image}
      <div>
        {postObjects.title}
        {postObjects.author}
      </div>
    </Container>;

    postObjects.actions = 
    <div className="button-line">
      <div className="standard">
        <Button className={`like ${isLiked == 1 ? "active" : ""}`} value={"like"} onClick={likeDislike} disabled={isDeleted}>
            {post.likes} {post.likes == 1 ? " Like" : " Likes"} 
        </Button>
        <Button className={`dislike ${isLiked == -1 ? "active" : ""}`} value={"dislike"} onClick={likeDislike} disabled={isDeleted}>
            {post.dislikes} {post.dislikes == 1 ? " Dislike" : " Dislikes"} 
        </Button>
        <Button onClick={e => setMakeComment(true)} disabled={isDeleted}>Comment</Button>
      </div>
      <div className="is-op">
        {(author.id === userId) && <Button onClick={deletePostButton}>Delete</Button>}
      </div>
      <AddCommentPage {...{show : makeComment, setShow : setMakeComment, userId, postId, parentId : "root", token}}/>
    </div>
  }

  return (
    <div className="post-page">
      <Header currentPage={"home"}/>
      <Container className="post-body">
        {postObjects.content}
        {postObjects.actions}
        <div className="hr" />
        <Comments/>
      </Container>
      <Footer/>
    </div>
  ); 
}

function Comments() {
  const { postId } =  useParams();
  const commentState = useSelector(state => state.comments.state);
  const postCommentState = useSelector(state=>state.comments.currPostStatus);
  const postCommentsList = useSelector(state => state.comments.currPost);
  const rootCommentsList = postCommentsList.filter(comment => comment.parent == "root")
  const dispatch = useDispatch();

  // console.log(postCommentsList)



  useEffect(() => {
    if (commentState === "loaded" && postCommentState === "unloaded") {
      dispatch({type : "comments/getCommentsPost", payload : postId});
    }
  }, [commentState]);



  // We probably load all comments at once, so find only the comments that are root
  let commentObjects;
  if (commentState === "loaded") {
    commentObjects = rootCommentsList.map(comment => {
      return <Comment key={comment.id} {...{commentId : comment.id, threadParent: true}}/>
    })
  }

  return (
    <div className="comments">
      {commentObjects}
    </div>
  )
}



// Have a user store with a dictionary of users that contains usernames and pfps mayhaps
function Comment({commentId, _maxLevel = 1, threadParent = false}) {
  const dispatch = useDispatch();
  const options = {month : "numeric", day : "numeric", year : "numeric", hour : '2-digit', minute : '2-digit'}

  let { postId } =  useParams();
  postId = Number(postId);

  // comment prop will just be id
  const { author, comment } = CommentInfo(commentId);
  const createdTime = new Date(comment.created);

  const userId = useSelector(state => state.users.currentUser.id);
  const token = useSelector(state => state.users.currentUser.token);
  const isLiked = useSelector(state => likeStatus(state, commentId, false));
  // FIX liking comments does not update DOM

  const [makeComment, setMakeComment] = useState(false);
  const [editComment, setEditComment] = useState(false);

  // maxLevel for how many levels of comments to get. 0 means just the comment itself. 2 is default
  // Pull 5 comments per level
  const childrenList = comment ? comment.children : [];
  let childrenObjects = [];

  const [numShownComments, setNumComments] = useState(_maxLevel == 0 ? 0 : Math.min(childrenList.length, 5));
  const [maxLevel, setMaxLevel] = useState(_maxLevel);

  const isDeleted = comment.likes == -1;

  // ADD GUARDS
  if (!comment) return <></>;

  if (maxLevel > 0) {
    for (let i = 0; i < numShownComments; i++) {
      childrenObjects.push(<Comment key={childrenList[i].id} {...{commentId : childrenList[i].id, _maxLevel : maxLevel - 1}}/>)
    }
  }

  // console.log(childrenObjects)

  const expandComments = (e) => {
    if (maxLevel == 0) setMaxLevel(1);
    setNumComments(Math.min(numShownComments + 3, childrenList.length));
  }

  let expandButton;
  if (numShownComments < childrenList.length) {
    expandButton = <Button onClick={expandComments}>More</Button>
  }

  const deleteCommentButton = (e) => {
    deleteComment(commentId, token).then(res => res.json()).then(data => {
      dispatch ({type : "comments/update", payload : {id : comment.id, ...data}});
    });
  }

  const likeDislike = (e) => {
    let likeStatus = e.target.value == 'like' ? 1 : -1;
    dispatch(addLikeDislikeComment({
      id : userId
    },
    {
      id : commentId
    },
    likeStatus
    ))
  }

  let commentObjects = {
    author : "",
    content : "",
    time : "",
    commentForm : "",
    body : "",
  }

  if (comment.status === 'loaded') {
    commentObjects.author = 
    <Card.Header className="comment-header">
      <Image src={author.pfp || require("../imgs/pfp.png")} roundedCircle className="pfp"/>
      <Card.Text className="author-username">{author.username}</Card.Text>
      <Card.Text className="posted-time">{createdTime.toLocaleString(navigator.language, options)}</Card.Text>
    </Card.Header>

    commentObjects.content = 
    <Card.Body className="content">
      <Card.Text>{comment.content}</Card.Text>
    </Card.Body>

    commentObjects.footer =
    <>
      <AddCommentPage {...{show : makeComment, setShow : setMakeComment, userId, postId, parentId : commentId, token}}/>
    </>

    commentObjects.body = 
    <Card>
      {commentObjects.author}
      {commentObjects.content}
      <Card.Footer>
        {commentObjects.footer}
        <div className="button-line">
          <div className="standard">
            <Button className={`like ${isLiked == 1 ? "active" : ""}`} value={"like"} onClick={likeDislike} disabled={isDeleted}>
              {comment.likes} {comment.likes == 1 ? " Like" : " Likes"} 
            </Button>
            <Button className={`dislike ${isLiked == -1 ? "active" : ""}`} value={"dislike"} onClick={likeDislike} disabled={isDeleted}>
                {comment.dislikes} {comment.dislikes == 1 ? " Dislike" : " Dislikes"} 
            </Button>
            <Button className="add-comment" onClick={e => setMakeComment(true)}>Comment</Button>
            {expandButton}
          </div>
          {(author.id == userId) && 
          <div className="is-op">
            <Button onClick={e => setEditComment(true)}>Edit</Button>
            <Button onClick={deleteCommentButton}>Delete</Button>
          </div>}
        </div>
      </Card.Footer>
    </Card>
  }

  return (
    <Container className={`comment ${threadParent && "thread-parent"}`}>
      <EditCommentPage {...{show : editComment, setShow : setEditComment, commentId, token, prevComment : comment.content}}/>
      {commentObjects.body}
      <div className="hr"></div>
      {childrenObjects.length > 0 && 
      <div className="thread-children">
        {childrenObjects}
      </div>}
    </Container>
  )

}

export default PostPage;