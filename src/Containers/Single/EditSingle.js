import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react';
import styles from './EditSingle.module.css'

export default function Single(props) {

  let today = new Date();

  today = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear();

  const { topicId } = useParams();
  const client = useApolloClient();
  const [post, setPost] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [postBody, setpostBody] = useState(null)

  const handleEditorChange = (e) => {
    setpostBody(e.target.getContent());
  }

  console.log(
    'Content was updated:',
    postBody
  );

  if (props.user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  console.log(props.user?._id);
  console.log(post.userId);

  const dataTitle = React.createRef();
  const dataPostImageURL = React.createRef();
  const categoryId = React.createRef();
  const postStatus = React.createRef();
  const postVisibility = React.createRef();
  const postTags = React.createRef();

  useEffect(() => {
    const getPost = async () => {
      const res = await client.query({
        variables: { _id: topicId },
        query: gql`
          query post($_id: String){
            post(_id: $_id) {
              id
              userId
              postTitle
              postBody
              author
              postImageURL
              userId
              categoryId
              postStatus
              postVisibility
              postTags
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

    // updatedAt: String
    // createdAt: String

    const res = await client.mutate({
      variables: {
        _id,
        postTitle: dataTitle.current.value,
        postBody: postBody,
        author: props.user?.nickname,
        postImageURL: dataPostImageURL.current.value,
        userId: props.user?._id,
        categoryId: categoryId.current.value,
        postStatus: postStatus.current.value,
        postVisibility: postVisibility.current.value,
        postTags: postTags.current.value,
        updatedAt: today
      },
      mutation: gql`
        mutation updatePost(
          $_id: String,
          $postTitle: String,
          $author: String,
          $postBody: String
          $postImageURL: String
          $userId: String
          $categoryId: String
          $postStatus: String
          $postVisibility: String
          $postTags: [String]
          $updatedAt: String
        ){
          updatePost(
            _id: $_id,
            postTitle: $postTitle,
            author: $author,
            postBody: $postBody
            postImageURL: $postImageURL
            userId: $userId
            categoryId: $categoryId
            postStatus: $postStatus
            postVisibility: $postVisibility
            postTags: $postTags
            updatedAt: $updatedAt
          ) {
            id
            postTitle
            postBody
            author
            postImageURL
            userId
            categoryId
            postStatus
            postVisibility
            postTags
            updatedAt
          }
        }
    `,
    })

    if (res.data.updatePost.id) {
      document.getElementById("updatePostSuccess").innerText = 'Update successful!'
    }
    props.refetch()
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
    if (deletedId) {
      document.getElementById("updatePostSuccess").innerText = 'Delete successful!'
    }
    props.refetch()
  }

  if (post === 0) {
    return <h3>Loading...</h3>
  } else return (
    <div className={styles.main}>
      <div className={styles.contentArea}>
        <>{(props.user?._id === post.userId) ? <>
          <label className={styles.label}>Post title
            <input className={styles.input} ref={dataTitle} defaultValue={post.postTitle} />
          </label>
          <label className={styles.label}>Category
            <input className={styles.input} ref={categoryId} defaultValue={post.categoryId} />
          </label>
          <label className={styles.label}>Status
            <input className={styles.input} ref={postStatus} defaultValue={post.postStatus} />
          </label >
          <label className={styles.label}>Visibility
            <input className={styles.input} ref={postVisibility} defaultValue={post.postVisibility} />
          </label>
          <label className={styles.label}>Tags
            <input className={styles.input} ref={postTags} defaultValue={post.postTags} />
          </label>
          <label className={styles.label}>Cover
            <input className={styles.input} ref={dataPostImageURL} defaultValue={post.postImageURL} />
          </label>
          <Editor
            className={styles.rte}
            apiKey="q31wtvx0j17p1wh5gptlu2kd2v89ptvgdse9c710oyabnbzk"
            initialValue={post.postBody}
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
          <button className={styles.btn} onClick={() => updatePost(post.id)}>Submit</button>
          <button onClick={() => setShowConfirmDelete(!showConfirmDelete)} className={styles.deleteBtn}>Delete post</button>
          <div Style={`display: ${showConfirmDelete ? 'block' : 'none'}`}>
            <p>Are you sure?</p>
            <button className={styles.confirmDeleteYes} onClick={() => deletePost(post.id)}>Yes</button>
            <button onClick={() => setShowConfirmDelete(!showConfirmDelete)} className={styles.confirmDeleteNo}>No</button>
          </div>
          <p id="updatePostSuccess"></p>
          <p id="deletePostSuccess"></p>
        </> : <p>Log in to edit</p>}</>
      </div>
    </div>
  )
}