import React , { useContext } from "react"
import AuthContext from "../context/AuthContext"
export default function Login() {
  let {LoginUser} = useContext(AuthContext)
  return (
    <div>
      <form onSubmit={LoginUser}>
      <input type='email' name='username' placeholder='email'/><br/>
      <input type='password' name='password' placeholder='password'/><br/>
      <button type='submit' ></button>
      </form>
      
    </div>
  )
}
