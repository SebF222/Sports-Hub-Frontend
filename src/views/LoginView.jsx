import React, { useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
// import { useNavigate } from 'react-router-dom'

const LoginView = () => {
  const [email, setEmail] = useState('')
  // const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault()
    //login the user using the context function
    login(email, password)
    // login(username, password) // removed username
  }




  return (
    <div>LoginView
      <form onSubmit={(e)=>handleSubmit(e)}>
        <input type="email" placeholder='email' name='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        {/* <input type="username" placeholder='username' value={username} onChange={(e)=>setUsername(e.target.value)}/> */}
        <input type ="password" placeholder='password' name='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button type="submit">Submit</button>
      </form>
    </div>

  )
}

export default LoginView