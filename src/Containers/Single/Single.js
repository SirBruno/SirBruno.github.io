import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { useApolloClient } from '@apollo/react-hooks';
import { Button } from '@material-ui/core';
import gql from 'graphql-tag';
import axios from 'axios'

export default function Single(props) {

  console.log('Root');

  const { topicId } = useParams();
  const client = useApolloClient();
  const [post, setPost] = useState(0);

  if (props.user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  const dataTitle = React.createRef();
  const dataAuthor = React.createRef();
  const dataDescription = React.createRef();
  const dataPostImageURL = React.createRef();

  useEffect(() => {
    const getPost = async () => {
      const res = await client.query({
        variables: { _id: topicId },
        query: gql`
          query post($_id: String){
            post(_id: $_id) {
              id
              postTitle
              postBody
              author
              postImageURL
            }
          }
      `,
      })

      const postRes = await res.data.post
      setPost(postRes);
    }

    getPost()
  });

  const updatePost = async (_id) => {
    const res = await client.mutate({
      variables: {
        _id,
        postTitle: dataTitle.current.value,
        postBody: dataDescription.current.value,
        author: dataAuthor.current.value,
        postImageURL: dataPostImageURL.current.value
      },
      mutation: gql`
        mutation updatePost(
          $_id: String,
          $postTitle: String,
          $author: String,
          $postBody: String
          $postImageURL: String
        ){
          updatePost(
            _id: $_id,
            postTitle: $postTitle,
            author: $author,
            postBody: $postBody
            postImageURL: $postImageURL
          ) {
            id
            postTitle
            postBody
            author
            postImageURL
          }
        }
    `,
    })

    if (res.data.updatePost.id) {
      document.getElementById("updatePostSuccess").innerText = res.data.updatePost.id
    }

  }

  const deletePost = async (_id) => {
    const deletedPost = await client.mutate({
      variables: { _id },
      mutation: gql`
        mutation deletePost($_id: String){
          deletePost(_id: $_id) { id }
        }
    `,
    })
    const deletedId = await deletedPost.data.deletePost.id;
    console.log(deletedId);
    props.refetch()
  }

  if (post === 0) {
    return <h3>Loading...</h3>
  } else return (
    <div>
      <h3>{post.postTitle}</h3>
      <p>{post.id}</p>
      <p>{post.postBody}</p>
      <>{props.user != null ? <>
        <input ref={dataTitle} defaultValue={post.postTitle} />
        <br />
        <input ref={dataAuthor} defaultValue={post.author} />
        <br />
        <input ref={dataDescription} defaultValue={post.postBody} />
        <br />
        <input ref={dataPostImageURL} defaultValue={post.postImageURL} />
        <br />
        <button onClick={() => updatePost(post.id)}>Submit</button>
        <br />
        <Button onClick={() => deletePost(post.id)} style={{
          marginLeft: 10
        }}>Delete post</Button>
        <p id="updatePostSuccess"> Success? </p>
      </> : <p>Log in to edit</p>}</>
    </div>
  )
}