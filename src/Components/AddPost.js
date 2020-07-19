import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export default function AddPost(props) {

	const client = useApolloClient();
	const dataTitle = React.createRef();
	const dataAuthor = React.createRef();
	const dataDescription = React.createRef();


	const addPost = async () => {
		const res = await client.mutate({
			variables: {
				postTitle: dataTitle.current.value,
				author: dataAuthor.current.value,
				postBody: dataDescription.current.value,
				postLikes: 0
			},
			mutation: gql`
        mutation addPost($postTitle: String, $author: String, $postBody: String, $postLikes: Int){
          addPost(postTitle: $postTitle, author: $author, postBody: $postBody, postLikes: $postLikes) {
            id
            postTitle
            author
            postBody
						postLikes
          }
        }
    `,
		})

		const post = await res.data.addPost;
		props.setPosts([...props.posts, post]);
	}

	return (
    <div>
      <input ref={dataTitle} placeholder="Title" />
      <br />
      <input ref={dataAuthor} placeholder="Author" />
      <br />
      <input ref={dataDescription} placeholder="Description" />
      <br />
      <button onClick={() => addPost()}>Send</button>
      <br />
      <p id="req-response">request's response goes here...</p>
    </div>
  )
}