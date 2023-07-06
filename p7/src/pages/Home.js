import "../style/Home.scss";

import { Link } from "react-router-dom"
import { Header, Footer } from "../components/basic";
import { Container, Card, Tabs, Tab, Button, Row, Col } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getNewPosts, getPostById, getPosts } from "../redux/post";
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
    return (
        <div className="home-body">
            <Header />
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
                    <Container className="home-navs">
                        <Tabs style={{ justifySelf: "flex-start" }} className="home-tabs">
                            <Tab title="All"></Tab>
                            <Tab title="Work"></Tab>
                            <Tab title="Personal"></Tab>
                        </Tabs>
                        <Link to="/upload">
                            <Button>Upload</Button>
                        </Link>
                    </Container>
                    <Container className="home-posts">
                        <PostList/>
                    </Container>
                </Container>
            </Container>
            <Footer />
        </div>
    )
}

// getPosts should be getPostIds or something and only return ids. PostObject will then call the getPostInfo
// action which will give it all of the information that it needs
function PostList() {
    // const postsList = useSelector(state => state.posts.list);
    const postsList = useSelector(state => getPosts(state));
    
    const postsState = useSelector(state => state.posts.state);
    const dispatch = useDispatch();

    useEffect(() => {
        if (postsState === "initial") {
            dispatch(getNewPosts());
        }
    }, [postsState, dispatch]);

    let postObjects;
    if (postsState === "loaded") {
        postObjects = postsList.map(post => {
            // console.log(post._id)
            return <PostObject key={post._id} {...post}/>
        })

    }

    return (<>{postObjects}</>)
}

function PostObject(post) {
    // Take in post id or something so it can fill itself
    const author = useSelector(state => findUser(state, post.userId));
    const isLiked = useSelector(state => likeStatus(state, post._id));
    const dispatch = useDispatch();
    const userId = useSelector(state => state.users.currentUser._id);

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

    console.log(isLiked)
    
    return (
        <Card>
            <Card.Img variant="top" src={post.imageUrl}></Card.Img>
            <Card.Body>
                <Row>
                    <Col>
                            <Card.Text>{post.title} posted by {author ? author.email : ""}</Card.Text>
                    </Col>
                    <Col>
                        <Button disabled={false} value={"like"} onClick={likeDislike}>Like</Button>
                        <Button disabled={false} value={"dislike"} onClick={likeDislike}>Dislike</Button>
                    </Col>
                </Row>
                <Link to={`/post/${post._id}`}>Post Page</Link>
            </Card.Body>
        </Card>
    );
}

export default Home;
