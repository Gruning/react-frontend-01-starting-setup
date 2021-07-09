import React,{useState, useCallback, useEffect} from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Users from './user/pages/Users'
import NewPlace from './places/pages/NewPlace'
import UserPlaces from './places/pages/UserPlaces'
import UpdatePlace from "./places/pages/UpdatePlace";
import MainNavigation from './shared/components/Navigation/MainNavigation'
import Auth from './user/pages/Auth'
import {AuthContext} from './shared/context/auth-context'

const App =() => {
  const [token,setToken]= useState(false)
  const [userId, setUserId]= useState(false)


  
  const login = useCallback((uid,token) => {
    setToken(token) 
    setUserId(uid)
    const tokenExpirationdate = new Date( new Date().getTime() + 1000 *60 *60) 
    localStorage.setItem(
      'userData',
      JSON.stringify({userId:uid, token:token})
    )
  },[])

   useEffect(() =>{
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if(storedData && storedData.token){
      login(storedData.userId, storedData.token)
    }
  },[login])

  const logout = useCallback(()=>{
    setToken(false)
    setUserId(null)
    localStorage.removeItem('userData')
  },[])

  let routes
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces/>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace/>
        </Route>
        <Redirect to='/'/>
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces/>
        </Route>
        <Route path='/auth'>
          <Auth/>
        </Route>
        <Redirect to='/auth'/>
      </Switch>
    )
  }

  return(
    <AuthContext.Provider 
    value={{
      isLoggedIn:!!token,
      token:token,
      userId:userId,
      login:login,
      logout:logout
    }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  ) 
}

export default App