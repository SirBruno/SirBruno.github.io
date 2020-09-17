import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import axios from 'axios'

export default function AddPost(props) {

  let today = new Date();

  today = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear();

  const client = useApolloClient();
  const dataTitle = React.createRef();
  const dataDescription = React.createRef();
  const dataCategoryId = React.createRef();
  const dataPostStatus = React.createRef();
  const dataPostVisibility = React.createRef();
  const dataPostImageURL = React.createRef();
  const dataPostTags = React.createRef();
  const [user, setUser] = useState(null)


  if (user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? setUser(res.data.user) : null);
  }

  const addPost = async () => {
    const res = await client.mutate({
      variables: {
        postTitle: dataTitle.current.value,
        author: user.username,
        postBody: dataDescription.current.value,
        userId: user._id,
        categoryId: dataCategoryId.current.value,
        postStatus: dataPostStatus.current.value,
        postVisibility: dataPostVisibility.current.value,
        postImageURL: dataPostImageURL.current.value,
        postTags: dataPostTags.current.value,
        updatedAt: today,
        createdAt: today,
        postLikes: 0
      },
      mutation: gql`
        mutation addPost(
          $postTitle: String,
          $author: String,
          $postBody: String,
          $postLikes: Int,
          $userId: String,
          $categoryId: String,
          $postStatus: String,
          $postVisibility: String
          $postImageURL: String
          $postTags: [String]
          $updatedAt: String
          $createdAt: String
        ){
          addPost(
            postTitle: $postTitle,
            author: $author,
            postBody: $postBody,
            postLikes: $postLikes,
            userId: $userId,
            categoryId: $categoryId,
            postStatus: $postStatus,
            postVisibility: $postVisibility
            postImageURL: $postImageURL
            postTags: $postTags
            updatedAt: $updatedAt
            createdAt: $createdAt
          ) {
            id
            postTitle
            author
            postBody
						postLikes
            userId
            categoryId
            postStatus
            postVisibility
            postImageURL
            postTags
            updatedAt
            createdAt
          }
        }
    `,
    })

    const post = await res.data.addPost;
    if (post.id == null) {
      document.getElementById("req-response").innerText = 'ERROR'
    } else {
      document.getElementById("req-response").innerText = post.id
      console.log(props.posts)
      props.refetch()
    }
  }

  return (
    <div id="loggedInUser">{
      user == null
        ? <p>You're not logged in.</p>
        : <div>
          <p>Logged in as: <span>{user.username}</span></p>
          <input defaultValue={user._id} placeholder="Title" />
          <br />
          <input defaultValue={user.username} placeholder="Title" />
          <br />
          <input ref={dataTitle} placeholder="Title" />
          <br />
          <input ref={dataDescription} placeholder="Post Body" />
          <br />
          <input ref={dataCategoryId} placeholder="Category Id" />
          <br />
          <input ref={dataPostStatus} placeholder="Post Status" />
          <br />
          <input ref={dataPostVisibility} placeholder="Post Visibility" />
          <br />
          <input ref={dataPostImageURL} placeholder="Post image" />
          <br />
          <input ref={dataPostTags} placeholder="Tags" />
          <br />
          <button onClick={() => addPost()}>Send</button>
          <br />
          <p id="req-response">request's response goes here...</p>
        </div>
    }</div>
  )
}