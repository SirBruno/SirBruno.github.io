import React, { useState } from 'react';
import './Posts.styles.css';
import imgPlaceholder from '../assets/image-placeholder.jpg'
import axios from 'axios'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Loader from 'react-loader-spinner'
import ReactHtmlParser from 'react-html-parser';

export default function Posts(props) {

	// const [page, setPage] = useState(0)
	const [pageNum, setPageNum] = useState(null)
	// const [postLength, setPostLength] = useState(null)
	const [lastPage, setLastPage] = useState(null)
	// const [postCategory, setPostCategory] = useState(false)
	const [categoryToggle, setCategoryToggle] = useState(false)
	const [categories, setCategories] = useState(null)
	const client = useApolloClient();

	if (props.user == null) {
		axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
	}

	if (categories === null) {
		client.query({
			query: gql`
			query categories {
				categories {
					id
					categoryTitle
				}
			}
	`,
		}).then(x => setCategories(x.data.categories))
	}

	// if (postCategory === false) {
	// 	client.query({
	// 		query: gql`
	// 			query posts {
	// 				posts (
	// 					pageSize: 1073741824
	// 				) {
	// 					hasMore
	// 					cursor
	// 					posts {
	// 						id
	// 					}
	// 				}
	// 			}
	// 	`,
	// 	}).then(x => x.data.posts.posts.length > 0 ? setPostLength(x.data.posts.posts.length) : setPostLength(0))
	// } else {
	// 	console.log('entered')
	// 	client.query({
	// 		variables: {
	// 			category: postCategory
	// 		},
	// 		query: gql`
	// 			query posts ($category: String) {
	// 				posts (
	// 					pageSize: 1073741824,
	// 					category: $category
	// 				) {
	// 					hasMore
	// 					cursor
	// 					posts {
	// 						id
	// 					}
	// 				}
	// 			}
	// 	`,
	// 	}).then(x => x.data.posts.posts.length > 0 ? setPostLength(x.data.posts.posts.length) : setPostLength(0))
	// }

	// const { loading, error, data, refetch } = useQuery(GET_POSTS(19, `"${page}"`, postCategory === false ? null : `"${postCategory}"`), {fetchPolicy: "cache-and-network"})

	// if (error) console.log(error)

	if (lastPage === null) {
		setLastPage(Math.ceil(props.postLength / 19))
	} else if ((lastPage !== null) && (props.postLength !== null)) {
		console.log('Entered last page.')
		console.log(props.postLength)
		if (lastPage !== Math.ceil(props.postLength / 19)) {
			setLastPage(Math.ceil(props.postLength / 19))
		}
	}

	console.log('postLength: ' + props.postLength)

	if ((props.page === 0) && pageNum !== 1) {
		setPageNum(1)
	} else if ((props.page === (19 * 1)) && pageNum !== 2) {
		setPageNum(2)
	} else if ((props.page === (19 * 2)) && pageNum !== 3) {
		setPageNum(3)
	} else if ((props.page === (19 * 3)) && pageNum !== 4) {
		setPageNum(4)
	} else if ((props.page === (19 * 4)) && pageNum !== 5) {
		setPageNum(5)
	}

	console.log(props.data)

	if (props.loading) {
		return <div className="loadSpinner"><Loader
			type="TailSpin"
			color="#fff"
			height={100}
			width={100}
		/></div>
	} else if (props.data.posts.posts.length > 0) {
		return (
			<div>
				<div className="postCategories">
					{
						categories !== null ? categories.map(c => c.categoryTitle !== "All" ? <button style={{ opacity: `${props.postCategory === c.categoryTitle ? 1 : null}` }} key={c.id} className="categoryToggle" id={c.categoryTitle} onClick={() => {
							if (categoryToggle === false) {
								props.setPostCategory(c.categoryTitle)
								setCategoryToggle(true)
							} else {
								if (props.postCategory === c.categoryTitle) {
									setCategoryToggle(false)
									props.setPostCategory(false)
								} else {
									props.setPostCategory(c.categoryTitle)
								}
							}
						}}>#{c.categoryTitle}</button> : null) : null
					}
				</div>
				<div className="postsOuter">
					{props.data.posts.posts.map(posts =>
						<div key={posts.id} className="postContainer">
							<img src={posts.postImageURL ? posts.postImageURL : imgPlaceholder} alt="no img found" />
							<div className="postInfo">
								<a id="postTitle" href={`/post/${posts.id}`}>{posts.postTitle}</a>
								<p>{
									// posts.postBody.match("<p>s*(.+?)s*</p>")[0].replace(/(<([^>]+)>)/ig, "")
									posts.postBody?.match("<p>s*(.+?)s*</p>") ? ReactHtmlParser(posts.postBody.match("<p>s*(.+?)s*</p>")[0].replace(/(<([^>]+)>)/ig, ""))
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
					<li id={props.page === 0 ? "current" : null} onClick={() => {
						if (props.page === 0) {
							return null
						} else if (props.page === (19 * 1)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(0)
						} else if (props.page === (19 * 2)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 1)
						} else if (props.page === (19 * 3)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 2)
						} else if (props.page === (19 * 4)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 3)
						}
					}}><i class="fas fa-angle-left"></i></li>
					<li id={props.page === 0 ? "current" : null} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(0) }}>
						1
						</li>
					{props.postLength > 19 ?
						<li id={props.page === (19 * 1) ? "current" : null} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 1) }}>
							2
						</li>
						: null
					}
					{props.postLength > (19 * 2) ?
						<li id={props.page === (19 * 2) ? "current" : null} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 2) }}>
							3
						</li>
						: null
					}
					{props.postLength > (19 * 3) ?
						<li id={props.page === (19 * 3) ? "current" : null} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 3) }}>
							4
						</li>
						: null
					}
					{props.postLength > (19 * 4) ?
						<li id={props.page === (19 * 4) ? "current" : null} onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 4) }}>
							5
						</li>
						: null
					}
					<li id={pageNum === lastPage ? "current" : null} onClick={() => {
						if (pageNum === lastPage) {
							return null
						} else if (props.page === 0) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 1)
						} else if (props.page === (19 * 1)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 2)
						} else if (props.page === (19 * 2)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 3)
						} else if (props.page === (19 * 3)) {
							window.scrollTo({ top: 0, behavior: 'smooth' }); props.setPage(19 * 4)
						}
					}}><i class="fas fa-angle-right"></i></li>
				</ul>
			</div>
		)
	} else return <div>
		<div className="postCategories">
			{
				categories !== null ? categories.map(c => c.categoryTitle !== "All" ? <button style={{ opacity: `${props.postCategory === c.categoryTitle ? 1 : null}` }} key={c.id} className="categoryToggle" id={c.categoryTitle} onClick={() => {
					if (categoryToggle === false) {
						props.setPostCategory(c.categoryTitle)
						setCategoryToggle(true)
					} else {
						if (props.postCategory === c.categoryTitle) {
							setCategoryToggle(false)
							props.setPostCategory(false)
						} else {
							props.setPostCategory(c.categoryTitle)
						}
					}
				}}>#{c.categoryTitle}</button> : null) : null
			}
		</div>
		<div className="postsOuter">
			<div className="noPostsFound">
				<p>No posts found</p>
			</div>
		</div>
	</div>
}