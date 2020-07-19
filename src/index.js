import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import Home from './Containers/Home/Home'
import Post from './Containers/Post/Post'

const uri = 'https://archetypeofficial.herokuapp.com/graphql';
const client = new ApolloClient({ uri });


function App() {

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <div>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/post">Post</Link>
            </nav>
            <Switch>
              <Route path="/post">
                <Post />
              </Route>
              <Route path="/">
                <Home />
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