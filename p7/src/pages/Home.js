import "../Home.scss";

import { Link } from "react-router-dom"
import { Header, Footer } from "../components/basic";
import { Container, Card, Tabs, Tab, Button } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getNewPosts, getPostById, getPosts } from "../redux/post";
import { findUser } from "../redux/user";

// const Home = () => {
//     return <h1>
//         <Link to="../test">Home</Link>
//     </h1>;
//   };
// Look into tabs?
function Home() {
    return (
        <div className="home-body">
            <Header />
            <Container className="home">
                <Container className="home-sidebar">
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </Container>
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
                        {/* <PostObject />
                        <PostObject />
                        <PostObject />
                        <PostObject /> */}
                        <PostList/>
                    </Container>
                </Container>
            </Container>
            <Footer />
        </div>
    )
}

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
    const user = useSelector(state => findUser(state, post.userId));
    
    return (
        <Card>
            <Card.Img variant="top" src={post.imageUrl}></Card.Img>
            <Card.Body>
                <Card.Text>
                    {post.title} posted by {user ? user.email : ""}
                </Card.Text>
                <Link to={`/post/${post._id}`}>Post Page</Link>
            </Card.Body>
        </Card>
    );
}

export default Home;
