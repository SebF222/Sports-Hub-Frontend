import React from 'react'
import { NavLink } from 'react-router-dom'

const ProfileView = () => {
  return (
    <div>
      ProfileView
      <h3>Profile</h3>
      <ul>
        <NavLink to='/'>Home</NavLink>
      </ul>
    </div>
  )
}

export default ProfileView