import "../style/Home.scss";

import { Link } from "react-router-dom"
import { Header, Footer } from "../components/basic";
import { Container, Card, Tabs, Tab, Button, Row, Col, Image } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPostById, getPosts } from "../redux/post";
import { findUser, likeStatus } from "../redux/user";
import { addLikeDislikePost } from "../redux/actions";

// const Home = () => {
//     return <h1>
//         <Link to="../test">Home</Link>
//     </h1>;
//   };
// Look into tabs?

// Idea : Make posts into their own little component thingy, then home/postpage can take that info
// and present it how they need to, instead of both of them needing to go to the store. Or is that the same thing. Idk

// Yes, but I think most important is just that functionality is shared between them. So for example, the likeDislike 
// thingy should be the same function between both.

function Home() {
    const [filterRead, setFilterRead] = useState(false);

    return (
        <div className="home-body">
            <Header currentPage={"home"}/>
            <Container className="home">
                {/* <Container className="home-sidebar">
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </Container> */}
                <Container className="home-main">
                    {/* <Container className="home-navs">
                        <Tabs style={{ justifySelf: "flex-start" }} className="home-tabs">
                            <Tab title="All"></Tab>
                            <Tab title="Work"></Tab>
                            <Tab title="Personal"></Tab>
                        </Tabs>
                        <Link to="/upload">
                            <Button>Upload</Button>
                        </Link>
                    </Container> */}
                    <Button onClick={e => setFilterRead(!filterRead)} className="filter-read">
                        {filterRead ? "Show All Posts" : "Show Unread Posts"}
                    </Button>
                    <Container className="home-posts">
                        <PostList filterRead={filterRead}/>
                    </Container>
                </Container>
            </Container>
            <Footer />
        </div>
    )
}

// getPosts should be getPostIds or something and only return ids. PostObject will then call the getPostInfo
// action which will give it all of the information that it needs
function PostList({filterRead = false}) {
    // const postsList = useSelector(state => state.posts.list);
    const postsList = useSelector(state => getPosts(state));
    const userReadList = useSelector(state => state.users.currentUser.readPosts);
    
    const postsState = useSelector(state => state.posts.state);
    const empty = <div>Nothing to see here!</div>

    let postObjects = [];
    if (postsState === "loaded") {
        postObjects = postsList.map(post => {
            const isRead = (userReadList.indexOf(post._id) != -1);
            if (isRead && filterRead) return
            return <PostObject key={post._id} {...{post, isRead}}/>
        })

    }
    
    postObjects = postObjects.filter(object => object != undefined);

    return (<>{postObjects.length > 0 ? postObjects : empty}</>)
}

function PostObject({post, isRead}) {
    // Take in post id or something so it can fill itself
    const author = useSelector(state => findUser(state, post.userId));
    const isLiked = useSelector(state => likeStatus(state, post._id));
    const dispatch = useDispatch();
    const userId = useSelector(state => state.users.currentUser._id);

    const createdTime = new Date(post.created);
    const options = {month : "numeric", day : "numeric", year : "numeric", hour : '2-digit', minute : '2-digit'}

    const likeDislike = (e) => {
        let likeStatus = e.target.value === 'like' ? 1 : -1;
        dispatch(addLikeDislikePost({
            _id: userId
        },
        {
            _id : post._id
        },
        likeStatus
        ))
    }
    
    return (
        <Card className={`post ${isRead ? 'isRead' : ""}`}>
            <Link to={`/post/${post._id}`}>
                <Card.Img className="post-img" variant="top" src={post.imageUrl}></Card.Img>
            </Link>
            <Card.Body className="post-body">
                <Row>
                    <Col className="card-text">
                        <Link to={`/post/${post._id}`}>
                            <Card.Text className="post-title">{post.title}</Card.Text>
                        </Link>
                        <Link to={`/user/${post.userId}`} className="post-author">
                            <Card.Text className="pre-author">Posted by </Card.Text>
                            <Image roundedCircle src={author ? author.pfp : require("../imgs/pfp.png")} className="pfp"/>
                            <Card.Text className="author">{author ? author.email : ""}</Card.Text>
                        </Link>
                        <Card.Text className="post-time">{createdTime.toLocaleString(navigator.language, options)}</Card.Text>
                    </Col>
                </Row>
                <Row>
                    <Col className="likeDislike">
                        <Button className={`like ${isLiked == 1 ? "active" : ""}`} value={"like"} onClick={likeDislike}>
                            {post.likes} {post.likes == 1 ? " Like" : " Likes"} 
                        </Button>
                        <Button className={`dislike ${isLiked == -1 ? "active" : ""}`} value={"dislike"} onClick={likeDislike}>
                            {post.dislikes} {post.dislikes == 1 ? " Dislike" : " Dislikes"} 
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default Home;
