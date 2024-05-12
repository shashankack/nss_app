import React , { useContext } from "react"
import AuthContext from "../context/AuthContext"
export default function Login() {
  let {LoginUser} = useContext(AuthContext)
  return (
    <div>
      <form onSubmit={LoginUser}>
      <input type='email' name='username' placeholder='email'autoComplete="current-username"/><br/>
      <input type='password' name='password' placeholder='password'autoComplete="current-password"/><br/>
      <button type='submit' ></button>
      </form>
      
    </div>
  )
}
