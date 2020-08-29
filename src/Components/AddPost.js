import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export default function AddPost(props) {

	const client = useApolloClient();
	const dataTitle = React.createRef();
	const dataAuthor = React.createRef();
	const dataDescription = React.createRef();
	const dataUserId = React.createRef();
	const dataCategoryId = React.createRef();
	const dataPostStatus = React.createRef();
	const dataPostVisibility = React.createRef();

	const addPost = async () => {
		const res = await client.mutate({
			variables: {
				postTitle: dataTitle.current.value,
				author: dataAuthor.current.value,
				postBody: dataDescription.current.value,
				userId: dataUserId.current.value,
				categoryId: dataCategoryId.current.value,
				postStatus: dataPostStatus.current.value,
				postVisibility: dataPostVisibility.current.value,
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
          }
        }
    `,
		})

    const post = await res.data.addPost;
    if (post.id == null) {
      document.getElementById("req-response").innerText = 'ERROR'
    } else {
      document.getElementById("req-response").innerText = post.id
      props.setPosts([post, ...props.posts]);
    }

	}

	return (
    <div>
      <input ref={dataTitle} placeholder="Title" />
      <br />
      <input ref={dataAuthor} placeholder="Author" />
      <br />
      <input ref={dataDescription} placeholder="Post Body" />
      <br />

      {/*  */}
      <input ref={dataUserId} placeholder="User Id" />
      <br />
      <input ref={dataCategoryId} placeholder="Category Id" />
      <br />
      <input ref={dataPostStatus} placeholder="Post Status" />
      <br />
      <input ref={dataPostVisibility} placeholder="Post Visibility" />
      <br />
      {/*  */}

      <button onClick={() => addPost()}>Send</button>
      <br />
      <p id="req-response">request's response goes here...</p>
    </div>
  )
}