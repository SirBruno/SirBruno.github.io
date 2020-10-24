import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import axios from 'axios'
import './Single.css'
import ReactHtmlParser from 'react-html-parser';

export default function Single(props) {

  const { topicId } = useParams();
  const client = useApolloClient();
  const [post, setPost] = useState(0);
  const [comments, setComments] = useState(null);
  const commentBody = React.createRef();

  if (props.user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  console.log(props.user?._id);
  console.log(post.likedBy);

  useEffect(() => {
    const getPost = async () => {
      const res = await client.query({
        variables: { _id: topicId },
        query: gql`
          query post($_id: String){
            post(_id: $_id) {
              id
              postTitle
              author
              postBody
              postLikes
              userId
              categoryId
              postComments
              postStatus
              postVisibility
              postImageURL
              postTags
              cursor
              likedBy
              updatedAt
              createdAt
            }
          }
      `,
      })

      const postRes = await res.data.post
      setPost(postRes);
    }

    getPost()

    if ((post.postComments?.length > 0) && comments == null) {

      const fetchComments = async () => {
        let arr = [];

        let x = await post.postComments.map(id =>
          client.query({
            variables: { _id: id },
            query: gql`
            query comment($_id: String){
              comment(_id: $_id) {
                id
                userId
                commentBody
              }
            }
        `,
          }).then(res => [...arr, res.data.comment.commentBody])
        )

        Promise.all(x).then((values) => {
          setComments(values);
        });
      }

      fetchComments()
    }
  });

  // const fetchSingleUser = async (id) => {
  //   let res = await client.query({
  //     variables: { _id: id },
  //     query: gql`
  //     query user($_id: String){
  //       user(_id: $_id) {
  //         id
  //         nickname
  //       }
  //     }
  // `,
  //   })
  //   setNicknames([...nicknames, {id: res.data.user.id, nickname: res.data.user.nickname}])
  //   console.log(nicknames)
  //   return res.data.user.nickname
  // }

  const updatePost = async (_id, newComment) => {

    let arr = post.postComments;
    arr.push(newComment);

    // console.log(...post.postComments)
    const res = await client.mutate({

      variables: {
        _id,
        postComments: arr
      },
      mutation: gql`
        mutation updatePost(
          $_id: String,
          $postComments: [String]
        ){
          updatePost(
            _id: $_id,
            postComments: $postComments
          ) {
            id
          }
        }
    `,
    })


    if (res.data.updatePost.id) {
      // document.getElementById("updatePostSuccess").innerText = 'Update successful!'
      console.log('apparently worked')
    }
    props.refetch()
  }

  const addLike = async (_id, userId) => {

    if (post.likedBy.includes(userId) === false) {
      post.likedBy.push(userId)
      const res = await client.mutate({
        variables: {
          _id,
          likedBy: post.likedBy,
          postLikes: ++post.postLikes
        },
        mutation: gql`
          mutation updatePost(
            $_id: String,
            $likedBy: [String],
            $postLikes: Int
          ){
            updatePost(
              _id: $_id,
              likedBy: $likedBy
              postLikes: $postLikes
            ) {
              id
            }
          }
      `,
      })

      if (res.data.updatePost.id) {
        console.log('Post Liked :)')
        console.log(post);
      }

      props.refetch()
    } else {

      // ------------------------------
      let arr = post.likedBy
      let index = arr.indexOf(userId);
      if (index > -1) {
        arr.splice(index, 1);
      }
      // ------------------------------

      const res = await client.mutate({
        variables: {
          _id,
          likedBy: arr,
          postLikes: --post.postLikes
        },
        mutation: gql`
          mutation updatePost(
            $_id: String,
            $likedBy: [String],
            $postLikes: Int
          ){
            updatePost(
              _id: $_id,
              likedBy: $likedBy
              postLikes: $postLikes
            ) {
              id
            }
          }
      `,
      })

      if (res.data.updatePost.id) {
        console.log('Post Unliked :(')
      }

      props.refetch()
    }
  }

  console.log(commentBody.current?.value)

  const addComment = async () => {

    console.log(commentBody.current.value)

    const res = await client.mutate({
      variables: {
        userId: props.user?._id,
        commentBody: commentBody.current.value,
      },
      mutation: gql`
        mutation addComment(
          $userId: String,
          $commentBody: String
        ){
          addComment(
            userId: $userId,
            commentBody: $commentBody
          ) {
            id
            userId
            commentBody
          }
        }
    `,
    })

    const comment = await res.data.addComment;
    if (comment.id == null) {
      document.getElementById("req-response").innerText = 'ERROR'
    } else {
      document.getElementById("req-response").innerText = 'Comment added successfully!'
      updatePost(post.id, comment.id)
      setComments(comments == null ? [comment.commentBody] : [...comments, comment.commentBody])
      props.refetch()
    }
  }

  console.log(comments)

  if (post === 0) {
    return <h3>Loading...</h3>
  } else return (
    <div className="SingleComponent">
      <div className="singlePostContainer">
        <div className="singlePostTop">
          <img className="SinglePostImage" src={post.postImageURL} alt="Post cover" />
          <div className="SingePostTitleArea">
            <h3 className="singlePostTitle">{post.postTitle}</h3>
            <div className="SinglePostMeta">
              <p className="SingleMetaTitle">Posted by: <span className="SinglePostAuthor">
                <a className="SingleEditPost" href={`/singleprofile/${post.userId}`}>{post.author}</a>
              </span></p>
              <br />
              <i className="SingleMetaTitle">Date: <b>{post.createdAt}</b></i>
              <i className="SingleMetaTitle">Category: <b>{post.categoryId}</b></i>
              <i className="SingleMetaTitle">Tags: <b>{post.postTags}</b></i>
              <i className="SingleMetaTitle">Likes: <b>{post.postLikes}</b></i>
              {props.user?._id ?
                <div>
                  {post.likedBy.includes(props.user?._id) === false
                    ? <i onClick={() => addLike(post.id, props.user?._id)} className="SingleLikeButton far fa-heart"></i>
                    : <i onClick={() => addLike(post.id, props.user?._id)} className="SingleLikeButton fas fa-heart"></i>
                  }
                </div>
                : null
              }
              <br />
            </div>
            {(props.user?._id === post.userId) || (props.user?.userPermission === 'ADMIN') ? <a className="SingleEditPost" href={`/edit/${post.id}`}><i class="far fa-edit"></i> Edit post</a> : null}
          </div>
        </div>
        <div>
          <div className="SinglePostBody">{ReactHtmlParser(post.postBody)}</div>
        </div>
        <div>
          <p>Comments</p>
        </div>
        <div>
          <textarea className="SinglePostComment" ref={commentBody}></textarea>
          <button className="SinglePostBtn" onClick={() => addComment()}>Submit</button>
          <p id="req-response"></p>
          <div className="SingleComments">{
            comments != null ? comments.map(x => <div>
              <textarea disabled className="SinglePostComment">{x}</textarea>
            </div>) : null
          }</div>
        </div>
      </div>
    </div>
  )
}