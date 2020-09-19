import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import axios from 'axios'
import './Single.css'

export default function Single(props) {


  const { topicId } = useParams();
  const client = useApolloClient();
  const [post, setPost] = useState(0);

  if (props.user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  console.log(props.user?._id);
  console.log(post.userId);

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
  });

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
              <p className="SingleMetaTitle">Posted by: <span className="SinglePostAuthor">{post.author}</span></p>
              <br />
              <i className="SingleMetaTitle">Date: <b>{post.createdAt}</b></i>
              <i className="SingleMetaTitle">Category: <b>{post.categoryId}</b></i>
              <i className="SingleMetaTitle">Tags: <b>{post.postTags}</b></i>
            </div>
          </div>
        </div>
        <div>
          <p className="SinglePostBody">{post.postBody}</p>
        </div>
      </div>
    </div>
  )
}