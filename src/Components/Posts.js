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
		if (data) setPosts(data.posts.posts)
	}, [data]);

	if (error) throw new error()

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
		setPosts(posts.filter(post => post.id !== deletedId))
	}

	if (loading) {
		return <p>Loading...</p>
	} else if (posts.length > 0) {
		console.log('lel');
		return (
			<div>
				<AddPost posts={ posts } setPosts={ setPosts } />
				<div className="booksOuter">
					{posts.map(posts =>
						<div key={posts.id} className="bookContainer">
							<p>{ posts.postTitle }</p>
							<p>{ posts.postBody }</p>
							<a href={`/post/${posts.id}`} style={{ display: "inline", fontWeight: "bold", fontSize: "20px" }}>{posts.id}</a>
							<Button onClick={() => deletePost(posts.id)} style={{
								background: "#000",
								color: "#fff",
								marginLeft: 10
							}}>X</Button>
						</div>
					)}
				</div>
			</div>
		)
	} else return null
}