import React from 'react'
import { Switch, Route, useRouteMatch } from "react-router-dom"
import EditSingle from '../Single/EditSingle';

export default function Post(props) {

  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <EditSingle setUser={props.setUser} user={props.user} posts={props.posts} setPosts={props.setPosts} refetch={props.refetch} />
        </Route>
      </Switch>
    </div>
  )
}