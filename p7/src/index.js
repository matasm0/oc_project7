// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import Entry from "./pages/Login";
import Upload from "./pages/Upload";
import Data from "./components/data";

import store from "./redux/store";
import { Provider } from "react-redux";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Entry />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Entry isLogin/>} />
          <Route path="signup" element={<Entry />} />
          <Route path="post/:postId" element={<PostPage />} />
          <Route path="upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Add another high level component somewhere whos only job is to keep track of localStorage stuff
// like login
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Data />
    <App />
  </Provider>
  );