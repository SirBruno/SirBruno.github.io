import React from 'react'
import { Switch, Route, useRouteMatch, Link } from "react-router-dom"
import Single from '../Single/Single';

export default function Post() {

  const match = useRouteMatch();

  return (
    <div>
        <h2>Post ...</h2>
        <ul>
        <li>
          <Link to={`${match.url}/single`}>Single post (example)</Link>
        </li>
      </ul>
        <Switch>
          <Route path={`${match.path}/:topicId`}>
            <Single />
          </Route>
          <Route path={match.path}>
            <h3>Please select a topic.</h3>
          </Route>
        </Switch>
      </div>
  )
}