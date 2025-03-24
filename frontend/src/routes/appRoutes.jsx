import React from 'react'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import Register from '../screens/Register'
import Login from '../screens/Login'
import Home from '../screens/Home'
import Project from '../screens/Project'
import UserAuth from '../auth/UserAuth'
const AppRoutes = () => {
  return (
    <BrowserRouter>
     <Routes>
        <Route path='/' element={<UserAuth><Home /></UserAuth>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/Project' element={<UserAuth><Project /></UserAuth>} />
     </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes