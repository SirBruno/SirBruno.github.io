import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import styles from './Profile.module.css'
import axios from 'axios'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default function Profile(props) {

  const { topicId } = useParams();
  const [stuff, setStuff] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [singleUser, setSingleUser] = useState(null);
  const client = useApolloClient();

  if (props.user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  const getExp = async () => {
    const fetchPosts = await client.query({
      variables: { _id: topicId },
      query: gql`
      query user($_id: String){
        user(_id: $_id) {
          id
          userPosts
          userImageURL
          nickname
          userDescription
        }
      }
  `,
    })

    if (fetchPosts.data.user?.id) {
      setSingleUser(fetchPosts.data.user)
    }

    if (topicId) {

      const xxx = async () => {
        let counter = 0;
        let posts = [];
        let lel = 0;
        await fetchPosts.data.user?.userPosts.forEach(async (x) => {

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

          // incrementa o "counter" lá em cima
          counter++;

          // soma o valor de curtidas do post na variável "lel"
          lel += postRes.data.post.likedBy.length

          // bota um objeto com id e título de um post no vetor "posts" lá em cima
          posts.push({ id: postRes.data.post.id, postTitle: postRes.data.post.postTitle })

          // se o estado "stuff" tiver vazio, quer dizer que o componente tá montando pela primeira vez
          if (stuff === null) {

            // se "counter" for menor que o número de posts do usuário, define o estado como "lel"
            // lembrando, "lel" é o valor acumulado atual do número de curtidas que o post tem
            if (counter <= fetchPosts.data.user.userPosts.length) {

              // define o estado com o cálculo de exp do post a cada iteração
              setStuff(lel)
              
              // define o estado como todos os posts do usuário, cortado pra no máximo 10
              setUserPosts(posts.slice(0, 10))
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

  console.log(userPosts)

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
    singleUser?.id ?
      <div className={styles.main}>
        <div className={styles.contentMain}>
          <div className={styles.contentFirstCol}>
            <img className={styles.userImageURL} src={singleUser?.userImageURL} alt="profile-pic" />
            <p className={styles.nickname}>{singleUser?.nickname}</p>
            <p className={styles.userDescription}>{singleUser?.userDescription}</p>
            <p className={styles.userLevel}><span className={styles.meta}>Level:</span> {stuff * 1}</p>
            <p className={styles.userExp}><span className={styles.meta}>Exp:</span> {stuff * 5000}</p>
            <p className={styles.userRanking}><span className={styles.meta}>Ranking:</span> {getRanking(stuff)}</p>
          </div>
          <div>
            <div className={styles.userPosts}>
              <h2>Recent Posts</h2>
              {
                userPosts !== null ? userPosts.map(x => <a className={styles.postLinks} href={`/post/${x.id}`}>{x.postTitle}</a>) : null
              }
            </div>
          </div>
        </div>
      </div>
      :
      <div className={styles.main}>
        <div className={styles.contentMainNotFound}>
          <p>User not found.</p>
        </div>
      </div>
  )
}