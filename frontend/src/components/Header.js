import React from 'react'
import { Link } from 'react-router-dom'
export default 
function Header () {
  return (
    <div>
      <Link to ="/">Home</Link>
      <span> | </span>
      <Link to ="/Login">Login</Link>   
    </div>
  )
}
