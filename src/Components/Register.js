import React from 'react'
import axios from 'axios'
import styles from './Register.module.css'

export default function Register(props) {

  const userEmail = React.createRef();
  const userNickname = React.createRef();
  const userPassword = React.createRef();

  if (props.user == null) {
		axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  const register = () => {
    axios({
      method: 'post',
      url: 'http://localhost:4000/register',
      headers: {},
      data: {
        username: userEmail.current.value,
        nickname: userNickname.current.value,
        password: userPassword.current.value
      }
    }).then(res => console.log(res)).catch(e => console.log(e));
  }

  return (
    !props.user ?
    <div className={styles.main}>
      <div className={styles.contentArea}>
        <input className={styles.input} ref={userEmail} placeholder="Email"></input>
        <input className={styles.input} ref={userNickname} placeholder="Nickname"></input>
        <input type="password" className={styles.input} ref={userPassword} placeholder="Password"></input>
        <button className={styles.btn} onClick={() => register()}>Register</button>
      </div>
    </div>
    :
    <div className={styles.main}>
      <div className={styles.contentArea}>
        <p>Can't register while logged in.</p>
      </div>
    </div>
  )
}