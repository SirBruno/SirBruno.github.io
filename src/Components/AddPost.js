import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react';

export default function AddPost(props) {

  const [postBody, setpostBody] = useState(null)

  const handleEditorChange = (e) => {
    setpostBody(e.target.getContent());
  }

  console.log(
    'Content was updated:',
    postBody
  );

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

  if (props.user == null) {
		axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
	}

  const addPost = async () => {
    const res = await client.mutate({
      variables: {
        postTitle: dataTitle.current.value,
        author: props.user.username,
        postBody: postBody,
        userId: props.user._id,
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
      props.user == null
        ? <p>You're not logged in.</p>
        : <div>
          <p>Logged in as: <span>{props.user.username}</span></p>
          <input defaultValue={props.user._id} placeholder="Title" />
          <br />
          <input defaultValue={props.user.username} placeholder="Title" />
          <br />
          <input ref={dataTitle} placeholder="Title" />
          <br />
          <input ref={dataDescription} placeholder="Post Body" />
          <Editor
        apiKey="q31wtvx0j17p1wh5gptlu2kd2v89ptvgdse9c710oyabnbzk"
        initialValue="<p>Initial content</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image',
            'charmap print preview anchor help',
            'searchreplace visualblocks code',
            'insertdatetime media table paste wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic | alignleft aligncenter alignright | \bullist numlist outdent indent | help'
        }}
        onChange={handleEditorChange}
      />
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