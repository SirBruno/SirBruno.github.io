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
import SingleProfile from '../Single/SingleProfile'
import { useQuery } from '@apollo/react-hooks'
import GET_POSTS from '../../Queries/GET_DATA'
import '../../index.css';
import axios from 'axios'
import logo from '../../assets/studium-logo.png'
import gql from 'graphql-tag'

const uri = 'http://localhost:4000/graphql';
const client = new ApolloClient({ uri });

export default function Home() {

  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [page, setPage] = useState(0)
	const [postLength, setPostLength] = useState(null)
	const [postCategory, setPostCategory] = useState(false)

  if (user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? setUser(res.data.user) : null);
  }

  if (postCategory === false) {
		client.query({
			query: gql`
				query posts {
					posts (
						pageSize: 1073741824
					) {
						hasMore
						cursor
						posts {
							id
						}
					}
				}
		`,
		}).then(x => x.data.posts.posts.length > 0 ? setPostLength(x.data.posts.posts.length) : setPostLength(0))
	} else {
		console.log('entered')
		client.query({
			variables: {
				category: postCategory
			},
			query: gql`
				query posts ($category: String) {
					posts (
						pageSize: 1073741824,
						category: $category
					) {
						hasMore
						cursor
						posts {
							id
						}
					}
				}
		`,
		}).then(x => x.data.posts.posts.length > 0 ? setPostLength(x.data.posts.posts.length) : setPostLength(0))
	}

  const { loading, error, data, refetch } = useQuery(GET_POSTS(19, `"${page}"`, postCategory === false ? null : `"${postCategory}"`), {fetchPolicy: "cache-and-network"})

	if (error) console.log(error)

  // if (error) console.log(error)

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <div>
            <header className="header">
              <div className="logo">
                <img src={logo} alt="logo" />
              </div>
              <nav className="mainNav">
                <Link to="/">Home</Link>
                <Link to={`/singleprofile${user?._id ? '/' + user?._id : ''}`}>Profile</Link>
                <Link to="/addpost">Add Post</Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </nav>
              {user != null ? <div className="headerUserArea">
                <div>
                  <div className="loggedInUser">
                    <p>Logged in as</p>
                  </div>
                  <div className="username">
                    <p>{user.nickname}</p>
                  </div>
                </div>
                <a href={
                  (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ?
                    "http://localhost:4000/logout?redir=http://localhost:3000/" :
                    "http://localhost:4000/logout?redir=https://archetype-fe.vercel.app/"
                }><i className="fas fa-sign-out-alt logoutBtn"></i></a>
              </div> : <div className="headerUserArea">
                  <div className="username">
                    <p>Not logged in</p>
                  </div>
                  <div></div>
                </div>}
            </header>
            <Switch>
              <Route path="/login">
                <Login setUser={setUser} user={user} />
              </Route>
              <Route path="/register">
                <Register setUser={setUser} user={user} />
              </Route>
              <Route path="/addpost">
                <AddPost setUser={setUser} user={user} setPosts={setPosts} />
              </Route>
              <Route path="/post">
                <Post setUser={setUser} user={user} setPosts={setPosts} refetch={refetch} />
              </Route>
              <Route path="/singleprofile">
                <SingleProfile setUser={setUser} user={user} setPosts={setPosts} />
              </Route>
              <Route path="/edit">
                <Edit setUser={setUser} user={user} setPosts={setPosts} refetch={refetch} />
              </Route>
              <Route path="/">
                <Posts postCategory={postCategory} setPostCategory={setPostCategory} page={page} setPage={setPage} postLength={postLength} loading={loading} data={data} posts={posts} setPosts={setPosts} client={client} setUser={setUser} user={user} />
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