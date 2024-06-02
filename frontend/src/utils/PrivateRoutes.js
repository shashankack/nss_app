import React, {Route,Navigate, Outlet} from 'react-router-dom'

const PrivateRoutes = ({children , ...rest}) => {
    let auth = {'token':false}
    console.log("login first")
    return (
    
    auth.token ? <Outlet/> :<Navigate to= "/login" /> 
  
  )
}

export default PrivateRoutes
