import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/analytics";
import Main from "./pages/Main";
import Setting from "./pages/setting";
import StoreDashboard from "./pages/store-dashboard";
import Settlements from "./pages/settlements";
import BulkPayout from "./pages/bulk-payout";
import Selete from "./pages/selete";
import Bank from "./pages/Bank";

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
      <Route path="/expenses" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>}/>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>}/>
      <Route path="/store-dashboard" element={<ProtectedRoute><StoreDashboard /></ProtectedRoute>}/>
      <Route path="/bank" element={<ProtectedRoute><Bank /></ProtectedRoute>}/>
      <Route path="/settlements" element={<ProtectedRoute><Selete /></ProtectedRoute>}/>
      {/* <Route path="/settlements" element={<ProtectedRoute><Settlements /></ProtectedRoute>}/> */}
      <Route path="/bulk-payout" element={<ProtectedRoute><BulkPayout /></ProtectedRoute>}/>
    </Routes>
  );
}

export default App;
