import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import GET_POSTS from '../Queries/GET_DATA'
import gql from 'graphql-tag';
import './Books.styles.css';

export default function Books(props) {

	const [posts, setPosts] = useState([])
	const client = useApolloClient();
	const dataTitle = React.createRef();
	const dataAuthor = React.createRef();
	const dataDescription = React.createRef();

	const { loading, error, data } = useQuery(GET_POSTS);

	useEffect(() => {
		if (data) setPosts(data.posts)
	}, [data]);

	if (error) throw new error()

	const deleteBook = async (_id) => {
		const deletedBook = await client.mutate({
			variables: { _id },
			mutation: gql`
        mutation deleteBook($_id: String){
          deleteBook(_id: $_id) { id }
        }
    `,
		})
		const deletedId = await deletedBook.data.deleteBook.id;
		setPosts(posts.filter(post => post.id !== deletedId))
	}

	const addBook = async () => {
		const res = await client.mutate({
			variables: {
				title: dataTitle.current.value,
				author: dataAuthor.current.value,
				description: dataDescription.current.value
			},
			mutation: gql`
        mutation addBook($title: String, $author: String, $description: String){
          addBook(title: $title, author: $author, description: $description) {
            id
            title
            author
            description
          }
        }
    `,
		})

		const post = await res.data.addPost;
		setPosts([...posts, post]);
	}

	if (loading) {
		return <p>Loading...</p>
	} else if (posts.length > 0) {
		return (
			<div>
				<input ref={dataTitle} placeholder="Title" />
				<br />
				<input ref={dataAuthor} placeholder="Author" />
				<br />
				<input ref={dataDescription} placeholder="Description" />
				<br />
				<button onClick={() => addBook()}>Send</button>
				<br />
				<p id="req-response">request's response goes here...</p>
				<div className="booksOuter">
					{posts.map(posts =>
						<div key={posts.id} className="bookContainer">
							<a href={`/post/${posts.id}`} style={{ display: "inline", fontWeight: "bold", fontSize: "20px" }}>{posts.postTitle}</a>
							<Button onClick={() => deleteBook(posts.id)} style={{
								background: "#000",
								color: "#fff",
								marginLeft: 10
							}}>X</Button>
							<p>{posts.author}</p>
							<i>{posts.postBody}</i>
						</div>
					)}
				</div>
			</div>
		)
	} else return null
}