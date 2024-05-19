import {Navigate} from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../utils/api"
import { REFRESH_TOKEN,ACCESS_TOKEN } from "../utils/constants"
import { useState,useEffect } from "react"
import { auth } from './auth';
    function ProtectedRoutes ({children}){
        const [isAuthorized,setIsAuhtorized] = useState(null);

        useEffect(()=>{
            auth().catch(()=> setIsAuhtorized(false))
        },[])

        const refreshtoken = async()=>{
            const refreshtoken= localStorage.getItem(REFRESH_TOKEN)
                try{
                    const response = await api.post("/api/token/refresh/",
                    {refresh:refreshtoken});
                    if (response.status === 200 ){
                        localStorage.setItem(ACCESS_TOKEN,response.data.access)
                        setIsAuhtorized(true)
                    }
                }
                catch(error){
                    console.log(error)
                    setIsAuhtorized(false)
            
        } 
        const auth = async()=>{
            const token = localStorage.getItem(ACCESS_TOKEN);
            if(!token){
                setIsAuhtorized(false)
                return
            }
            const decoded = jwtDecode(token)
            const tokenExpiration =decoded.exp
            const now = Date.now()/1000
        }
        if(isAuthorized === null){
            return <div>Loading...</div>
        }
        return isAuthorized ?  children : <Navigate to="/login"  />

    }

    }
       
export default ProtectedRoutes


