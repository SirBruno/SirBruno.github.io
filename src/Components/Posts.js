import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import GET_POSTS from '../Queries/GET_DATA'
import gql from 'graphql-tag';
import './Posts.styles.css';
import AddPost from './AddPost';

export default function Posts(props) {

	const [posts, setPosts] = useState([])
	const client = useApolloClient();

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

	if (loading) {
		return <p>Loading...</p>
	} else if (posts.length > 0) {
		return (
			<div>
				<AddPost posts={ posts } setPosts={ setPosts } />
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