import "../Home.scss";

import { Link } from "react-router-dom"
import { Header, Footer } from "../components/basic";
import { Container, Card, Tabs, Tab, Button } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPosts } from "../redux/post";

// const Home = () => {
//     return <h1>
//         <Link to="../test">Home</Link>
//     </h1>;
//   };
// Look into tabs?
function Home() {
    return (
        <div className="home-body">
            <PostList/>
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
                        <PostObject />
                        <PostObject />
                        <PostObject />
                        <PostObject />
                    </Container>
                </Container>
            </Container>
            <Footer />
        </div>
    )
}

function PostList() {
    const postsList = useSelector(state => state.posts.list);
    const postsState = useSelector(state => state.posts.state);
    const dispatch = useDispatch();

    useEffect(() => {
        if (postsState === "initial") {
            dispatch(getPosts());
        }
    }, [postsState, dispatch]);

    return (<></>)
}

function PostObject() {
    // Take in post id or something so it can fill itself
    return (
        <Card>
            <Card.Img variant="top" src={require("../imgs/DATBOI.jpg")}></Card.Img>
            <Card.Body>
                <Card.Text>
                    Testing testing
                </Card.Text>
                <Link to={`/post/1`}>Post Page  </Link>
            </Card.Body>
        </Card>
    );
}

export default Home;
