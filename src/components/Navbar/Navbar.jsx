import React from 'react'
import { NavLink } from 'react-router-dom'


const Navbar = () => {
  return (
    <div>
        <h1>SPORTS HUB</h1> 
        <ul>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/login'>Login</NavLink>
            <NavLink to='/profile'>Profile</NavLink> 
        </ul>
    </div>
  )
}

export default Navbar