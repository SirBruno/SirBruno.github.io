import React, { useState } from 'react'
import axios from 'axios'

export default function () {

  const [user, setUser] = useState(null)
  const inputUsername = React.createRef();
	const inputPassword = React.createRef();

  if (user == null) {
    axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? setUser(res.data.user) : null);
  }

  const userAuth = async () => {
		const tryLoggin = await axios.get(`http://localhost:4000/login?username=${inputUsername.current.value}&password=${inputPassword.current.value}`, { withCredentials: true });

		if (user == null) {
			axios.get('http://localhost:4000/user', { withCredentials: true }).then(res => res.data.user ? setUser(res.data.user) : null);
		}

		return tryLoggin;
	}

  console.log(user);

  return (
    <> { user == null ? <>
      <input ref={inputUsername} placeholder="Username"></input>
      <br />
      <input ref={inputPassword} placeholder="Password"></input>
      <br />
      <button onClick={() => userAuth()}>Send</button>
      </> : "You're already logged in"}
    </>
  )
}