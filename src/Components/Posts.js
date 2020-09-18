import React from 'react';
import './Posts.styles.css';
import imgPlaceholder from '../assets/image-placeholder.jpg'
import axios from 'axios'

export default function Posts(props) {

	if (props.user == null) {
		axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
	}


	if (props.loading) {
		return <p>Loading...</p>
	} else if (props.data.posts.posts.length > 0) {
		return (
			<div>
				<div className="postsOuter">
					{props.data.posts.posts.map(posts =>
						<div key={posts.id} className="postContainer">
							<img src={posts.postImageURL ? posts.postImageURL : imgPlaceholder} alt="no img found" />
							<div className="postInfo">
								<a id="postTitle" href={`/post/${posts.id}`}>{posts.postTitle}</a>
								<p>{posts.postBody}</p>
								<div className="postMeta">
									<p>{posts.categoryId}</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	} else return null
}