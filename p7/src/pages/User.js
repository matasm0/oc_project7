import "../style/User.scss";

import { useDispatch, useSelector } from "react-redux";

import { Button, Card, Container, Form, Image, Tab, Tabs } from "react-bootstrap";
import { Footer, Header, ErrorModal } from "../components/basic";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CommentInfo, PostInfo, logout } from "../redux/actions";

async function updateUser(formData, userId, token) {
    return await fetch ('http://localhost:3001/api/users/update/' + userId, {
        method : "PUT",
        headers : {
            "Authorization" : "Bearer " + token,
        },
        body : formData,
    })
}

function PostObject({postId}) {

    const { author, post } = PostInfo(postId);

    if (post.status === "missing") return;
    if (post.likes == -1) return;
    if (author.status === "missing") author.username = "[Deleted]";

    return (
        <Link to={"/home"}>
            <Card className="post">
                <Card.Img src={post.image}/>
                <Card.Header>
                    <div>
                        <h4 className="title">{post.title}</h4>
                        <div className="author">
                            <Image src={author.pfp || require("../imgs/pfp.png")} roundedCircle className="pfp"/>
                            <Card.Text className="username">
                                {author ? author.username : ""}
                            </Card.Text>
                        </div>
                    </div>
                </Card.Header>
            </Card>
        </Link>
    )
}

function CommentObject({commentId}) {
    const {author, comment} = CommentInfo(commentId);
    const { post } = PostInfo(comment.postParent);
    const options = {month : "numeric", day : "numeric", year : "numeric", hour : '2-digit', minute : '2-digit'}

    if (comment.status == "missing") return;
    if (comment.likes == -1) return;

    const createdTime = new Date(comment.created);

    return (
        <Link to={"/post/" + post.id}>
            <div className="comment-object">
                <h4 className="comment-parent">On post: {post.title || "[Deleted]"}</h4>
                <Card className="comment">
                    <Card.Header className="comment-header">
                        <Image src={author.pfp || require("../imgs/pfp.png")} roundedCircle className="pfp"/>
                        <Card.Text>{author.username}</Card.Text>
                        <Card.Text>{createdTime.toLocaleString(navigator.language, options)}</Card.Text>
                    </Card.Header>
                    <Card.Body className="content">
                        <Card.Text>{comment.content}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </Link>
    )
}

export default function UserPage() {
    const currentUser = useSelector(state => state.users.currentUser);

    const { userId } = useParams("userId");
    const [ showError, setShowError ] = useState(false);
    const [ error, setError ] = useState("");
    const [user, setUser] = useState(
                                    <Container className="user-page-body">
                                        <Image src={require('../imgs/pfp.png')} className="pfp" roundedCircle/>
                                        <p>Username</p>
                                    </Container>
                                    );

    const postList = useSelector(state => state.posts.dict);

    useEffect(() => {
        fetch('http://localhost:3001/api/users/get/' + userId).then(res => res.json().then (
            currUser => {
            if (res.status == 200) {
                const empty = <p className="empty">Nothing to see here</p>

                let posts = [];
                currUser.posts.forEach(post => {
                    posts.push(<PostObject key={post} postId={post}/>)
                });

                let comments = [];
                currUser.comments.forEach(comment => {
                    comments.push(<CommentObject key={comment} commentId={comment}/>)
                });

                let likedPosts = [];
                currUser.likedPosts.forEach(post => {
                    likedPosts.push(<PostObject key={post} postId={post}/>)
                })

                let likedComments = [];
                currUser.likedComments.forEach(comment => {
                    likedComments.push(<CommentObject key={comment} commentId={comment}/>)
                })

            
                setUser(
                <Container className="user-page-body">    
                    <Image src={currUser.pfp || require('../imgs/pfp.png')} className='pfp' roundedCircle/>
                    <h2 className="username">{currUser.username}</h2>
                    {currentUser._id == currUser._id && <Link to={"/user/settings"} className="editProfile">Edit Profile</Link>}
                    <div className="tab-holder">
                        <Tabs className="tabs">
                            <div className="hr"></div>
                            <Tab eventKey="posts" title="Posts">
                                <div className="posts">
                                    {posts.length ? posts : empty}
                                </div>
                            </Tab>
                            <Tab eventKey="comments" title="Comments">
                                <div className="comments">
                                    {comments.length ? comments : empty}
                                </div>
                            </Tab>
                            <Tab eventKey="likedPosts" title="Liked Posts">
                                <div className="likedPosts">
                                    {likedPosts.length ? likedPosts : empty}
                                </div>
                            </Tab>
                            <Tab eventKey="likedComments" title="Liked Comments">
                                <div className="likedComments">
                                    {likedComments.length ? likedComments : empty}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Container>
                );
            }
            else {
                setUser(<p>User Does Not Exist</p>)
            }
        })).catch(e => {
            setShowError(true);
            setError("Network Error");
        })
    }, []);



    return (
        <div className="user-page">
            <Header currentPage={"home"}/>
            {user}
            <Footer/>
            <ErrorModal {...{show : showError, setShow : setShowError, error : error}}/>
        </div>
    )
    
}

export function UserSetup({firstTime = false}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = useSelector(state => state.users.currentUser.token);
    const userId = useSelector(state => state.users.currentUser._id);
    const currPfp = useSelector(state => state.users.currentUser.pfp);
    const currUsername = useSelector(state => state.users.currentUser.username);
    const [file, setFile] = useState();
    const [fileUrl, setFileUrl] = useState(currPfp || "");
    const [username, setUsername] = useState(currUsername || "");

    useEffect(()=>()=>{
        URL.revokeObjectURL(fileUrl);
    }, [])

    useEffect(() => {
        if (file) setFileUrl(URL.createObjectURL(file));
    }, [file])

    const updateUserButton = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", username || "");
        formData.append("image", file || "");

        updateUser(formData, userId, token).then(res => res.json()).then(
            newUser => {
                dispatch({type : "users/updateUser", payload : newUser});
                navigate("/home");
            }
        );
    }

    const deleteUser = (e) => {
        e.preventDefault();
        fetch("http://localhost:3001/api/users/delete/" + userId, {
            method: "PUT",
            headers : {
                "Authorization" : "Bearer " + token
            }
        }).then(res => res.json()).then(data => {
            dispatch(logout());
            navigate("/signup");
        })
    }

    return (
        <div className="user-setup">
            <Header currentPage={"home"}/>
            <Container className="user-setup-body">
                <Form onSubmit={updateUserButton} className="user-setup-form">
                    <Form.Group className="pfp-input">
                        <Image className="pfp" src={fileUrl ? fileUrl : require("../imgs/pfp.png")} roundedCircle />
                        <Form.Label>
                            {firstTime ? <p>Add Profile Picture</p> : <p>Change Profile Picture</p>}
                            <Form.Control type="file" accept="image/*" hidden onChange={e => setFile(e.target.files[0])}/>
                        </Form.Label>
                    </Form.Group>
                    <Form.Group className="username">
                        <Form.Label>{firstTime ? "Choose a cool username" : "Change your username"}</Form.Label>
                        <Form.Control type="text" onChange={e => setUsername(e.target.value)} value={username} className="username-input"/>
                        <Form.Text/>
                    </Form.Group>
                    {!firstTime ?
                        <>
                            <div className="button-holder">
                                <Button onClick={e => {navigate("/home")}}>Cancel</Button>
                                <Button type="submit">Apply</Button>
                            </div>
                            <Button  onClick={deleteUser} className="delete-user">Delete user</Button>
                        </> : 
                        <>
                            <Button onClick={e => {navigate("/home")}}>I'll do it later</Button>
                            <Button type="submit">Let's go!</Button>
                        </>
                    }
                </Form>
            </Container>
            <Footer />
        </div>
    )
}