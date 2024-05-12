import { createContext,useState,useEffect } from "react";

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children})=>{


    let [authTokens,setAuthTokens] = useState(null)
    let [ user , setUser]= useState(null)


    let LoginUser = async(e )=>{
        e.prevenDefault()
      let response = await fetch('',{
        method :'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify({'username':e.target.username.value,'password':e.target.password.value})
      }) 
      let data = await response.json()
      console.log('data:',data)
      console.log('response : ',response)
      if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
      }
      else{
        alert('Invalid Credentials')
      }
    }

    let contextData = {
        user:user,
        LoginUser:LoginUser 
    }
    return(
        <AuthContext.Provider value={({'name':'Aindra'})}>
            {children}
        </AuthContext.Provider>
    )
}