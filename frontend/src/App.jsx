import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import AIPrediction from './pages/AIPrediction';
import Social from './pages/Social';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-dark-bg text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><Dashboard /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><ProtectedLayout><Habits /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><ProtectedLayout><AIPrediction /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/social" element={<ProtectedRoute><ProtectedLayout><Social /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProtectedLayout><Profile /></ProtectedLayout></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
