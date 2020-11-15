import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react';
import styles from './AddPost.module.css'

export default function AddPost(props) {

  const [postBody, setpostBody] = useState(null)
  const [categories, setCategories] = useState(null)

  const handleEditorChange = (e) => { setpostBody(e.target.getContent()) }

  console.log('Content was updated:', postBody );

  // today = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear();

  const client = useApolloClient();
  const dataTitle = React.createRef();
  const dataCategoryId = React.createRef();
  const dataPostStatus = React.createRef();
  const dataPostVisibility = React.createRef();
  const dataPostImageURL = React.createRef();
  const dataPostTags = React.createRef();

  if (categories === null) {
    client.query({
      query: gql`
			query categories {
				categories {
					id
					categoryTitle
          categoryPosts
				}
			}
	`,
    }).then(x => setCategories(x.data.categories))
  }

  console.log(categories)

  if (props.user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  const addPost = async () => {
    const res = await client.mutate({
      variables: {
        postTitle: dataTitle.current.value,
        author: props.user.nickname,
        postBody: postBody,
        userId: props.user._id,
        categoryId: dataCategoryId.current.value,
        postStatus: dataPostStatus.current.value,
        postVisibility: dataPostVisibility.current.value,
        postImageURL: dataPostImageURL.current.value,
        postTags: dataPostTags.current.value,
        updatedAt: new Date(),
        createdAt: new Date(),
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

    const fetchUser = await client.query({
      variables: { _id: props.user?._id },
      query: gql`
      query user($_id: String){
        user(_id: $_id) {
          id
          userPosts
        }
      }
  `,
    })

    console.log(fetchUser.data.user.userPosts)
    console.log(res.data.addPost.id)

    const resUser = await client.mutate({
      variables: {
        _id: props.user._id,
        userPosts: [...fetchUser.data.user.userPosts, res.data.addPost.id]
      },
      mutation: gql`
        mutation updateUser(
          $_id: String,
          $userPosts: [String]
        ){
          updateUser(
            _id: $_id,
            userPosts: $userPosts
          ) {
            id
            userPosts
          }
        }
    `,
    })

    var data = categories
    var empIds = [dataCategoryId.current.value]
    var filteredArray = data.filter(function (itm) {
      return empIds.indexOf(itm.categoryTitle) > -1;
    })

    await client.mutate({
      variables: {
        _id: filteredArray[0].id,
        categoryPosts: [...filteredArray[0].categoryPosts, res.data.addPost.id]
      },
      mutation: gql`
        mutation updateCategory(
          $_id: String,
          $categoryPosts: [String]
        ){
          updateCategory(
            _id: $_id,
            categoryPosts: $categoryPosts
          ) {
            id
          }
        }
    `,
    }).then(x => console.log(x))

    console.log(resUser.data.updateUser)

    const post = await res.data.addPost;
    if ((post.id == null) || (resUser.data.updateUser.id == null)) {
      document.getElementById("req-response").innerText = 'ERROR'
    } else {
      document.getElementById("req-response").innerText = 'Post added successfully!'
      console.log(props.posts)
    }

    props.refetch()
  }

  return (
    <div className={styles.main}>
      <div id="loggedInUser">{
        props.user == null
          ? <p>You're not logged in.</p>
          : <div className={styles.contentArea}>
            <input className={styles.input} ref={dataTitle} placeholder="Title" />
            <div>
              <p className={styles.categoryHelpText}>Choose a category</p>
              <select ref={dataCategoryId} name="categoryId" className={styles.categoryIdSelector}>
                {
                  categories !== null ? categories.map(c => <option selected={c.categoryTitle === "All" ? "selected" : null} value={c.categoryTitle}>{c.categoryTitle}</option>) : null
                }
              </select>
            </div>
            <input className={styles.input} ref={dataPostStatus} value="Published" disabled placeholder="Post Status" />
            <input className={styles.input} ref={dataPostVisibility} value="Public" disabled placeholder="Post Visibility" />
            <input className={styles.input} ref={dataPostImageURL} placeholder="Post image" />
            <input className={styles.input} ref={dataPostTags} placeholder="Tags" />
            <Editor
              apiKey="q31wtvx0j17p1wh5gptlu2kd2v89ptvgdse9c710oyabnbzk"
              initialValue=""
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
            <button className={styles.btn} onClick={() => addPost()}>Send</button>
            <br />
            <p id="req-response"></p>
          </div>
      }</div>
    </div>
  )
}