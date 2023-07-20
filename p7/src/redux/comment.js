import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getComments = createAsyncThunk('comments/getComments', async () => {
    const res = await fetch('http://localhost:3001/api/comments/get');
    const data = await res.json();
    return data['comments'];
});

export const addLikeDislike = createAsyncThunk('comments/addLikeDislike', async (props) => {
    const {user, comment, likeStatus} = props;
    const res = await fetch('http://localhost:3001/api/comments/like/' + comment, 
    {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            userId : user,
            likeStatus : likeStatus,
        })
    })
    const data = await res.json();
    return data;
});


const initialState = {
    state: "unloaded",
    list: [], // Maybe pull and clear with each post?
    dict: {},
    currPost: [],
    currPostStatus: "unloaded",
};

const commentSlice = createSlice({
    name: "comments",
    initialState : {...initialState},
    reducers: {
        create(state, action) {
            // DOING Check the parent of the comment. If it is root then do nothing, if not then find its parent
            // in the dictionary and add it as a child.
            state.list.push(action.payload);
            state.dict[action.payload._id] = action.payload;
            if (action.payload.parent != "root") {
                state.dict[action.payload.parent].children.push(action.payload._id);
            }
            // We should probably check whether the postParent is the currentPost but realistically the only way to add a comment would be to be on the current post page
            state.currPost.push(action.payload);
        },
        remove(state, action) {
            delete state.dict[action.payload];
        },
        update(state, action) {
            state.dict[action.payload._id] = {...state.dict[action.payload._id], ...action.payload};
            state.list = Object.values(state.dict);
        },
        unload(state) {
            state.currPost = [];
            state.currPostStatus = "unloaded";
        },
        getCommentsPost(state, action) {
            state.currPost = state.list.filter(comment => comment.postParent == action.payload).sort((a, b) => b.created - a.created);
            state.currPostStatus = "loaded";
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getComments.pending, (state, action) => {
                state.state = "loading";
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.state = "loaded";
                state.list = action.payload;
                action.payload.forEach(comment => {
                    state.dict[comment._id] = comment;
                });
            })
    }
})


export const getCommentById = (state, id) => state.comments.lib[id] || {};
// Meed a method that will sort the comments by rating, or comments need to be sorted when they are fetched

// If we are getting rid of list, use dict.items or whatever the right attribute is
// Uhh dont the post and comments themselves have children lists???
export const getCommentsChildren = (state, id) => {
    return state.comments.currPost.filter(comment => comment.parent == id).sort((a, b) => b.created - a.created);
}
// Currently not properly adding comments to children to mongo. Fix and remove this selector


export const { create } = commentSlice.actions;

export default commentSlice.reducer;