import React, { useState } from 'react';
import './Posts.styles.css';
import imgPlaceholder from '../assets/image-placeholder.jpg'
import axios from 'axios'
import { useQuery } from '@apollo/react-hooks'
import GET_POSTS from '../Queries/GET_DATA'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Loader from 'react-loader-spinner'

export default function Posts(props) {

	const [page, setPage] = useState(0)
	const [pageNum, setPageNum] = useState(null)
	const [postLength, setPostLength] = useState(null)
	const [lastPage, setLastPage] = useState(null)
	const client = useApolloClient();

	if (postLength === null) {
		client.query({
			query: gql`
      query posts {
        posts (pageSize: 999999999) {
          hasMore
					cursor
					posts {
						id
					}
        }
      }
  `,
		}).then(x => x.data.posts.posts.length > 0 ? setPostLength(x.data.posts.posts.length) : setPostLength(0))
	}

	const { loading, error, data } = useQuery(GET_POSTS(19, `"${page}"`))

	if (error) console.log(error)

	if (props.user == null) {
		axios.get('https://archetypeofficial.herokuapp.com/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
	}

	// console.log(data?.posts?.posts[0]?.postBody.match("<p>s*(.+?)s*</p>")[0]?.replace(/(<([^>]+)>)/ig, ""))

	if(data && (lastPage === null) && (postLength !== null)) {
		setLastPage(Math.ceil(postLength/19))
	}

	if ((page === 0) && pageNum !== 1) {
		setPageNum(1)
	} else if ((page === (19 * 1)) && pageNum !== 2) {
		setPageNum(2)
	} else if ((page === (19 * 2)) && pageNum !== 3) {
		setPageNum(3)
	} else if ((page === (19 * 3)) && pageNum !== 4) {
		setPageNum(4)
	} else if ((page === (19 * 4)) && pageNum !== 5) {
		setPageNum(5)
	}

	if (loading) {
		return <div className="loadSpinner"><Loader
			type="TailSpin"
			color="#fff"
			height={100}
			width={100}
 		/></div>
	} else if (data.posts.posts.length > 0) {
		return (
			<div>
				<div className="postsOuter">
					{data.posts.posts.map(posts =>
						<div key={posts.id} className="postContainer">
							<img src={posts.postImageURL ? posts.postImageURL : imgPlaceholder} alt="no img found" />
							<div className="postInfo">
								<a id="postTitle" href={`/post/${posts.id}`}>{posts.postTitle}</a>
								<p>{
									// posts.postBody.match("<p>s*(.+?)s*</p>")[0].replace(/(<([^>]+)>)/ig, "")
									posts.postBody?.match("<p>s*(.+?)s*</p>") ? posts.postBody.match("<p>s*(.+?)s*</p>")[0].replace(/(<([^>]+)>)/ig, "")
										: posts.postBody.replace(/(<([^>]+)>)/ig, "")
								}</p>
								<div className="postMeta">
									<p>{posts.categoryId}</p>
								</div>
							</div>
						</div>
					)}
				</div>
				<ul className="postPagePagination">
					{/* postLength */}
					<li id={page === 0 ? "current" : null} onClick={() => {
						if (page === 0) {
							return null
						} else if (page === (19 * 1)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(0)
						} else if (page === (19 * 2)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 1)
						} else if (page === (19 * 3)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 2)
						} else if (page === (19 * 4)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 3)
						}
					}}><i class="fas fa-angle-left"></i></li>
					<li id={page === 0 ? "current" : null} onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(0)}}>
						1
						</li>
					{postLength > 19 ?
						<li id={page === (19 * 1) ? "current" : null} onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 1)}}>
							2
						</li>
						: null
					}
					{postLength > (19 * 2) ?
						<li id={page === (19 * 2) ? "current" : null} onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 2)}}>
							3
						</li>
						: null
					}
					{postLength > (19 * 3) ?
						<li id={page === (19 * 3) ? "current" : null} onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 3)}}>
							4
						</li>
						: null
					}
					{postLength > (19 * 4) ?
						<li id={page === (19 * 4) ? "current" : null} onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 4)}}>
							5
						</li>
						: null
					}
					<li id={pageNum === lastPage ? "current" : null} onClick={() => {
						if (pageNum === lastPage) {
							return null
						} else if (page === 0) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 1)
						} else if (page === (19 * 1)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 2)
						} else if (page === (19 * 2)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 3)
						} else if (page === (19 * 3)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); setPage(19 * 4)
						}
					}}><i class="fas fa-angle-right"></i></li>
				</ul>
			</div>
		)
	} else return null
}