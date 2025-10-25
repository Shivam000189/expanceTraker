import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate} from "react-router-dom";
import Signup from './pages/signup';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
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



