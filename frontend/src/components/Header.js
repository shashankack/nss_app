import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
export default 
function Header () {
  let {user} = useContext(AuthContext)
  return (
    <div>
      <Link to ="/">Home</Link>
      <span> | </span>
      <Link to ="/Login">Login</Link>  
      {user && <p>Hello {user.username}</p>}
       
    </div>
  )
}
