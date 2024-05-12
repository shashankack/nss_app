import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
export default 
function Header () {
  let {name} = useContext(AuthContext)
  return (
    <div>
      <Link to ="/">Home</Link>
      <span> | </span>
      <Link to ="/Login">Login</Link>  
      <p>Hello {name} </p> 
    </div>
  )
}
