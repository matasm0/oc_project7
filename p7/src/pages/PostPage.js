import { useParams } from "react-router-dom";

function PostPage () {
  const { postId } =  useParams();
  // useEffect(() => {})
  return (
    <>
      <img src={require("../imgs/DATBOI.jpg")} />
      <p>Dat boi</p>
    </>
  ); 
}

export default PostPage;
  