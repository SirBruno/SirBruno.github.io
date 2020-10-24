import React from 'react'
import { Switch, Route, useRouteMatch } from "react-router-dom"
import Profile from '../../Components/Profile';

export default function SingleProfile(props) {

  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Profile setUser={props.setUser} user={props.user} posts={props.posts} setPosts={props.setPosts} refetch={props.refetch} />
        </Route>
        <Route path={`${match.path}`}>
          <Profile setUser={props.setUser} user={props.user} posts={props.posts} setPosts={props.setPosts} refetch={props.refetch} />
        </Route>
      </Switch>
    </div>
  )
}