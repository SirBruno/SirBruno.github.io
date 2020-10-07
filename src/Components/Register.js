import React from 'react'
import styles from './Register.module.css'

export default function Register() {
  return (
    <div className={styles.main}>
      <div className={styles.contentArea}>
        <input className={styles.input} ref={null} placeholder="Email"></input>
        <input className={styles.input} ref={null} placeholder="Nickname"></input>
        <input type="password" className={styles.input} ref={null} placeholder="Password"></input>
        <button className={styles.btn} onClick={() => null}>Register</button>
      </div>
    </div>
  )
}