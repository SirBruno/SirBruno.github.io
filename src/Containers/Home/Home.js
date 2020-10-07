import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import Post from '../../Containers/Post/Post'
import Edit from '../../Containers/Post/Edit'
import Login from '../../Components/Login'
import AddPost from '../../Components/AddPost'
import Posts from '../../Components/Posts'
import Footer from '../../Components/Footer'
import Register from '../../Components/Register'
import { useQuery } from '@apollo/react-hooks'
import GET_POSTS from '../../Queries/GET_DATA'
import '../../index.css';

const uri = 'http://localhost:4000/graphql';
const client = new ApolloClient({ uri });

export default function Home() {
  
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)

  const { loading, error, data, refetch } = useQuery(GET_POSTS(8));

  if (error) console.log(error)

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <div>
            <header className="header">
              <div className="logo">LOGO</div>
              <nav className="mainNav">
              <Link to="/">Home</Link>
              <Link to="/post">Post</Link>
              <Link to="/addpost">Add Post</Link>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </nav>
              {user != null ? <div className="headerUserArea">
                <div className="loggedInUser">
                  <p>Logged in as</p>
                </div>
                <div className="username">
                  <p>{user.username}</p>
                </div>
                <div></div>
              </div> : <div className="headerUserArea">
                <div className="username">
                  <p>Not logged in</p>
                </div>
                <div></div>
              </div>}
            </header>
            <Switch>
              <Route path="/login">
                <Login setUser={setUser} user={user} loading={loading} />
              </Route>
              <Route path="/register">
                <Register setUser={setUser} user={user} loading={loading} />
              </Route>
              <Route path="/addpost">
                <AddPost setUser={setUser} user={user} loading={loading} data={data} setPosts={setPosts} refetch={refetch} />
              </Route>
              <Route path="/post">
                <Post setUser={setUser} user={user} loading={loading} data={data} setPosts={setPosts} refetch={refetch} />
              </Route>
              <Route path="/edit">
                <Edit setUser={setUser} user={user} loading={loading} data={data} setPosts={setPosts} refetch={refetch} />
              </Route>
              <Route path="/">
                <Posts posts={posts} setPosts={setPosts} data={data} loading={loading} client={client} setUser={setUser} user={user} />
              </Route>
            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    </ApolloProvider>
  )
}

// **********************************************************