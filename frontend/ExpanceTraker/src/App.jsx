import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/expense";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/analytics";
import Main from "./components/Main";
import Expenses from "./pages/dashboard";
import Setting from "./pages/setting";

function App() {

  return (
    <Router>
      <MainRoutes />
    </Router>
  );
}

function MainRoutes() {

  return (
    <Routes>
      <Route path="/" element={<Main></Main>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/expenses"element={<ProtectedRoute> <Expenses /> </ProtectedRoute>}/>
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>}/>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/setting" element={<Setting />} />

    </Routes>
  );
}

export default App;
