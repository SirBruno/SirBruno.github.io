import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import GET_POSTS from '../Queries/GET_DATA'
import gql from 'graphql-tag';
import './Posts.styles.css';
import AddPost from './AddPost';
import imgPlaceholder from '../assets/image-placeholder.jpg'
import axios from 'axios'

export default function Posts(props) {

	const [posts, setPosts] = useState([])
	const [user, setUser] = useState(null)
	const client = useApolloClient();

	const userAuth = async () => {
		const tryLoggin = await axios.get('http://localhost:4000/login?username=bruno&password=44444444', {withCredentials: true});
		const userData = await axios.get('http://localhost:4000/user', {withCredentials: true});
		console.log(tryLoggin);
		console.log(userData);
		
		// if (tryLoggin.status == 200) {
		// }
	}

	if (user == null) {
		userAuth();
	}

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
		return (
			<div>
				<AddPost posts={ posts } setPosts={ setPosts } />
				<div className="booksOuter">
					{posts.map(posts =>
						<div key={posts.id} className="bookContainer">
							<Button id="deleteBtn" onClick={() => deletePost(posts.id)} style={{
								marginLeft: 10
							}}>X</Button>
							<a id="postTitle" href={`/post/${posts.id}`}>{ posts.postTitle }</a>
							<p>{ posts.postBody }</p>
							<img src={ posts.postImageURL ? posts.postImageURL : imgPlaceholder } alt="no img found" />
							<p>{ posts.id }</p>
						</div>
					)}
				</div>
			</div>
		)
	} else return null
}