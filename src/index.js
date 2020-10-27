import React from 'react';
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import Home from './Containers/Home/Home'

import './index.css';

const uri = 'https://archetypeofficial.herokuapp.com/graphql';
const client = new ApolloClient({ uri });

function App() {

  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  )
}

// **********************************************************

ReactDOM.render(<App />, document.getElementById('root'));