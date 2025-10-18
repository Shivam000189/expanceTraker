import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/signup';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Dashboard1 from "./pages/dashboard1";
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  

  return (
    <Router>
        <Routes>
          <Route path='/signup' element={<Signup></Signup>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          {/* <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route> */}
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard></Dashboard></ProtectedRoute>}></Route>
        </Routes>

    </Router>
  )
}

export default App



