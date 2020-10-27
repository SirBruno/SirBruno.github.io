import React from 'react'
import axios from 'axios'
import styles from './Register.module.css'

export default function Register() {

  const userEmail = React.createRef();
  const userNickname = React.createRef();
  const userPassword = React.createRef();

  const register = () => {
    axios({
      method: 'post',
      url: 'https://archetypeofficial.herokuapp.com/register',
      headers: {},
      data: {
        username: userEmail.current.value,
        nickname: userNickname.current.value,
        password: userPassword.current.value
      }
    }).then(res => console.log(res)).catch(e => console.log(e));
  }

  return (
    <div className={styles.main}>
      <div className={styles.contentArea}>
        <input className={styles.input} ref={userEmail} placeholder="Email"></input>
        <input className={styles.input} ref={userNickname} placeholder="Nickname"></input>
        <input type="password" className={styles.input} ref={userPassword} placeholder="Password"></input>
        <button className={styles.btn} onClick={() => register()}>Register</button>
      </div>
    </div>
  )
}