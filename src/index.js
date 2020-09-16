import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
// import Home from './Containers/Home/Home'
import Post from './Containers/Post/Post'
import Login from './Components/Login'
import AddPost from './Components/AddPost'
import Posts from './Components/Posts'
import axios from 'axios'
import './index.css';

const uri = 'http://localhost:4000/graphql';
const client = new ApolloClient({ uri });


function App() {

  
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  console.log(posts);

  const getPostData = async () => {
    const res = await axios({
      url: 'http://localhost:4000/graphql',
      method: 'post',
      data: {
        query: `
          {
            posts (
              pageSize: 8
            ) {
              hasMore
              cursor
              posts {
                id
                postTitle
                author
                postBody
                postLikes
                userId
                categoryId
                postComments
                postStatus
                postVisibility
                postImageURL
                postTags
                cursor
                likedBy
                updatedAt
                createdAt
              }
            }
          }
          `
      }
    })
    // result.data.data.posts.posts
    setPosts(res.data.data.posts.posts)
  }

  console.log(posts);

  useEffect(() => {
    getPostData();
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <div>
            <nav className="mainNav">
              <Link to="/">Home</Link>
              <Link to="/post">Post</Link>
              <Link to="/addpost">Add Post</Link>
              <Link to="/login">Login</Link>
            </nav>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/addpost">
                <AddPost getPostData={getPostData} posts={posts} setPosts={setPosts} />
              </Route>
              <Route path="/post">
                <Post getPostData={getPostData} setUser={setUser} user={user} posts={posts} setPosts={setPosts} />
              </Route>
              <Route path="/">
                <Posts getPostData={getPostData} posts={posts} setPosts={setPosts} client={client} setUser={setUser} user={user} />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </ApolloProvider>
  )
}

// **********************************************************

ReactDOM.render(<App />, document.getElementById('root'));