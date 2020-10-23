import React from 'react'
import styles from './Profile.module.css'
import axios from 'axios'

export default function Profile(props) {

  if (props.user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  return (
    <div className={styles.main}>
      <div className={styles.contentMain}>
        <div className={styles.contentFirstCol}>
          <img className={styles.userImageURL} src={props.user?.userImageURL} alt="profile-pic" />
          <p className={styles.nickname}>{props.user?.nickname}</p>
          <p className={styles.userDescription}>{props.user?.userDescription}</p>
          <p className={styles.userLevel}><span className={styles.meta}>Level:</span> {props.user?.userLevel}</p>
          <p className={styles.userExp}><span className={styles.meta}>Exp:</span> {props.user?.userExp}</p>
          <p className={styles.userRanking}><span className={styles.meta}>Ranking:</span> {props.user?.userRanking}</p>
        </div>
        <div></div>
      </div>
    </div>
  )
}