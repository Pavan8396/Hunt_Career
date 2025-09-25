import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import SavedJobs from './pages/SavedJobs';
import AppliedJobs from './pages/AppliedJobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserTypeSelection from './pages/UserTypeSelection';
import EmployerLogin from './pages/EmployerLogin';
import EmployerSignup from './pages/EmployerSignup';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerLayout from './components/EmployerLayout';
import PostJobPage from './pages/PostJobPage';
import PostedJobsPage from './pages/PostedJobsPage';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem('token'); // Changed to sessionStorage
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<UserTypeSelection />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/employer/login" element={<EmployerLogin />} />
              <Route path="/employer/signup" element={<EmployerSignup />} />
              <Route path="/employer" element={<ProtectedRoute><EmployerLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<EmployerDashboard />} />
                <Route path="post-job" element={<PostJobPage />} />
                <Route path="posted-jobs" element={<PostedJobsPage />} />
              </Route>
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <SavedJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applied"
                element={
                  <ProtectedRoute>
                    <AppliedJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute>
                    <JobDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <div className="p-4 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold dark:text-gray-200">About</h1>
                    <p className="dark:text-gray-300">Learn more about Hunt-Career.</p>
                  </div>
                }
              />
              <Route
                path="/contact"
                element={
                  <div className="p-4 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold dark:text-gray-200">Contact</h1>
                    <p className="dark:text-gray-300">Contact us at support@hunt-career.com.</p>
                  </div>
                }
              />
              <Route
                path="/privacy"
                element={
                  <div className="p-4 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold dark:text-gray-200">Privacy Policy</h1>
                    <p className="dark:text-gray-300">Your privacy matters to us.</p>
                  </div>
                }
              />
              <Route path="*" element={<div className="p-4 text-center dark:text-gray-200">404 - Page Not Found</div>} />
            </Routes>
          </Layout>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
          />
        </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;