import React, { useState, useEffect } from 'react'
import styles from './Profile.module.css'
import axios from 'axios'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default function Profile(props) {

  const [stuff, setStuff] = useState(null);
  const client = useApolloClient();

  if (props.user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  const getExp = async () => {
    const fetchPosts = await client.query({
      variables: { _id: props.user?._id },
      query: gql`
      query user($_id: String){
        user(_id: $_id) {
          id
          userPosts
        }
      }
  `,
    })

    if (props.user?._id) {

      const xxx = async () => {
        let counter = 0;
        let lel = 0;
        await fetchPosts.data.user.userPosts.forEach(async (x) => {

          const postRes = await client.query({
            variables: { _id: x },
            query: gql`
            query post($_id: String){
              post(_id: $_id) {
                id
                postTitle
                likedBy
              }
            }
        `,
          })

          counter++;
          lel += postRes.data.post.likedBy.length
  
          if (stuff === null) {
            if (counter <= fetchPosts.data.user.userPosts.length) {
              setStuff(lel)
            }
          }
  
        })
      }
      xxx()
    }
  }

  useEffect(() => {
    getExp()
  })

  const getRanking = (x) => {
    if (x < 5) {
      return "Beginner"
    } else if (x < 50) {
      return "Novice"
    } else if (x < 100) {
      return "Intermediate"
    } else if (x < 500) {
      return "Advanced"
    } else if (x < 1000) {
      return "Legend"
    } else return null
  }

  return (
    <div className={styles.main}>
      <div className={styles.contentMain}>
        <div className={styles.contentFirstCol}>
          <img className={styles.userImageURL} src={props.user?.userImageURL} alt="profile-pic" />
          <p className={styles.nickname}>{props.user?.nickname}</p>
          <p className={styles.userDescription}>{props.user?.userDescription}</p>
          <p className={styles.userLevel}><span className={styles.meta}>Level:</span> {stuff*1}</p>
          <p className={styles.userExp}><span className={styles.meta}>Exp:</span> {stuff*5000}</p>
          <p className={styles.userRanking}><span className={styles.meta}>Ranking:</span> {getRanking(stuff)}</p>
        </div>
        <div></div>
      </div>
    </div>
  )
}