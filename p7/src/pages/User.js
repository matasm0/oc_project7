import "../style/User.scss";

import { useDispatch, useSelector } from "react-redux";

import { Button, Container, Form, Image, Tab, Tabs } from "react-bootstrap";
import { Footer, Header } from "../components/basic";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CommentInfo } from "../redux/actions";

async function updateUser(formData, userId, token) {
    return await fetch ('http://localhost:3001/api/users/update/' + userId, {
        method : "PUT",
        headers : {
            "Authorization" : "Bearer " + token,
        },
        body : formData,
    })
}

function PostObject(postId) {
    return <></>
}

function CommentObject({commentId}) {
    const {author, comment} = CommentInfo(commentId);


    return (
        <div className="user-comment">
            <Link to={"/home"}>{comment.content}</Link>
        </div>
    )
}

export default function UserPage() {
    const dispatch = useDispatch();

    const { userId } = useParams("userId");
    const [user, setUser] = useState(<Container className="user-page-body">
                                        <Image src={require('../imgs/pfp.png')} className="pfp" roundedCircle/>
                                        <p>Username</p>
                                    </Container>);

    const postList = useSelector(state => state.posts.dict);

    

    useEffect(() => {
        fetch('http://localhost:3001/api/users/get/' + userId).then(res => res.json()).then (
            currUser => {
                const empty = <p>Nothing to see here</p>

                let posts = [];
                currUser.posts.forEach(post => {
                    posts.push(<Link key={post} to={"/post/" + post}>{post}</Link>)
                });

                let comments = [];
                currUser.comments.forEach(comment => {
                    comments.push(<CommentObject key={comment} commentId={comment}/>)
                });

                let likedPosts = [];
                currUser.likedPosts.forEach(post => {
                    likedPosts.push(post)
                })

                let likedComments = [];
                currUser.likedComments.forEach(comment => {
                    likedComments.push(<CommentObject key={comment} commentId={comment}/>)
                })

            
                setUser(
                <Container className="user-page-body">
                    <Image src={currUser.pfp || require('../imgs/pfp.png')} className='pfp' roundedCircle/>
                    <h2>{currUser.username}</h2>
                    <Tabs>
                        <Tab eventKey="posts" title="Posts">
                            {posts.length ? posts : empty}
                        </Tab>
                        <Tab eventKey="comments" title="Comments">
                            {comments.length ? comments : empty}
                        </Tab>
                        <Tab eventKey="likedPosts" title="Liked Posts">
                            {likedPosts.length ? likedPosts : empty}
                        </Tab>
                        <Tab eventKey="likedComments" title="Liked Comments">
                            {likedComments.length ? likedComments : empty}
                        </Tab>
                    </Tabs>
                </Container>);
            }
        )
    }, []);



    return (
        <div className="user-page">
            <Header currentPage={"home"}/>
            {user}
            <Footer/>
        </div>
    )
    
}

export function UserSetup(firstTime = false) {
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

    return (
        <div className="user-setup">
            <Header currentPage={"home"}/>
            <Container className="user-setup-body">
                <Form onSubmit={updateUserButton} className="user-setup-form">
                    <Form.Group className="pfp-input">
                        <Image className="pfp" src={fileUrl ? fileUrl : require("../imgs/pfp.png")} roundedCircle />
                        <Form.Label>
                            <p>Add Profile Picture</p>
                            <Form.Control type="file" accept="image/*" hidden onChange={e => setFile(e.target.files[0])}/>
                        </Form.Label>
                    </Form.Group>
                    <Form.Group className="username">
                        <Form.Label>Choose a cool username</Form.Label>
                        <Form.Control type="text" onChange={e => setUsername(e.target.value)} value={username}/>
                        <Form.Text/>
                    </Form.Group>
                    <Button onClick={e => {navigate("/home")}}>I'll do it later</Button>
                    <Button type="submit">Let's go!</Button>
                </Form>
            </Container>
            <Footer />
        </div>
    )
}