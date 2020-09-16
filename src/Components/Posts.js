// import { useContext } from 'react';
// import EnvContext from '../Contexts/EnvContext'
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import GET_POSTS from '../Queries/GET_DATA'
import gql from 'graphql-tag';
import './Posts.styles.css';
import imgPlaceholder from '../assets/image-placeholder.jpg'
import axios from 'axios'

export default function Posts(props) {

	// console.log('Root');

	// const value = useContext(EnvContext);
	// console.log(value)

	// const [posts, setPosts] = useState([])

	// setInterval(() => {
	// 	axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? null : props.setUser(null)); 
	// }, 5000);

	if (props.user == null) {
		axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
	}

	const { loading, error, data } = useQuery(GET_POSTS);
	
	// useEffect(() => {
	// 	if (data) {
	// 		setPosts(data.posts.posts)
	// 	}
	// }, [data]);

	// if (data) props.setPosts(data.posts.posts)

	// if (data) {
	// 	console.log(data.posts.posts)
	// 	console.log(posts)
	// 	console.log(data.posts.posts !== posts);
	// }


	if (error) throw new error()

	if (loading) {
		return <p>Loading...</p>
	} else if (data.posts.posts.length > 0) {
		return (
			<div>
				<div id="loggedInUser">{
				props.user == null ? <p>You're not logged in.</p> : <p>Logged in as: <span>{props.user.username}</span></p>
				}</div>
				<div className="booksOuter">
					{props.posts.map(posts =>
						<div key={posts.id} className="bookContainer">
							<a id="postTitle" href={`/post/${posts.id}`}>{posts.postTitle}</a>
							<p>{posts.postBody}</p>
							<img src={posts.postImageURL ? posts.postImageURL : imgPlaceholder} alt="no img found" />
							<p>{posts.id}</p>
							<p><b>Author</b>: {posts.author}</p>
							<p><b>UserId</b>: {posts.userId}</p>
							<p><b>PostId</b>: {posts.id}</p>
						</div>
					)}
				</div>
			</div>
		)
	} else return null
}