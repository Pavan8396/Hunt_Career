import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import PostJobPage from './pages/PostJobPage';
import PostedJobsPage from './pages/PostedJobsPage';
import UserProfilePage from './pages/UserProfilePage';
import EmployerProfilePage from './pages/EmployerProfilePage';
import ApplicantsPage from './pages/ApplicantsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageJobsPage from './pages/AdminManageJobsPage';
import AdminPostJobPage from './pages/AdminPostJobPage';
import AdminEditJobPage from './pages/AdminEditJobPage';
import Layout from './components/Layout';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user && user.isAdmin ? children : <Navigate to="/home" />;
};

const GuestOrAuthenticatedRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem('token');
  return isAuthenticated ? (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  ) : (
    <Layout>{children}</Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <Routes>
              {/* Authenticated routes with the new sidebar layout */}
              <Route
                path="/saved"
                element={<ProtectedRoute><AuthenticatedLayout><SavedJobs /></AuthenticatedLayout></ProtectedRoute>}
              />
              <Route
                path="/applied"
                element={<ProtectedRoute><AuthenticatedLayout><AppliedJobs /></AuthenticatedLayout></ProtectedRoute>}
              />
              <Route
                path="/profile/:userId"
                element={<ProtectedRoute><AuthenticatedLayout><UserProfilePage /></AuthenticatedLayout></ProtectedRoute>}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute><AuthenticatedLayout><UserProfilePage /></AuthenticatedLayout></ProtectedRoute>}
              />
              <Route
                path="/employer"
                element={<ProtectedRoute><AuthenticatedLayout><Outlet /></AuthenticatedLayout></ProtectedRoute>}
              >
                <Route path="dashboard" element={<EmployerDashboard />} />
                <Route path="post-job" element={<PostJobPage />} />
                <Route path="post-job/:id" element={<PostJobPage />} />
                <Route path="posted-jobs" element={<PostedJobsPage />} />
                <Route path="jobs/:jobId/applicants" element={<ApplicantsPage />} />
                <Route path="profile" element={<EmployerProfilePage />} />
              </Route>

              <Route
                path="/admin/dashboard"
                element={<AdminRoute><AuthenticatedLayout><AdminDashboard /></AuthenticatedLayout></AdminRoute>}
              />
              <Route
                path="/admin/employer/:employerId/jobs"
                element={<AdminRoute><AuthenticatedLayout><AdminManageJobsPage /></AuthenticatedLayout></AdminRoute>}
              />
              <Route
                path="/admin/post-job"
                element={<AdminRoute><AuthenticatedLayout><AdminPostJobPage /></AuthenticatedLayout></AdminRoute>}
              />
              <Route
                path="/admin/edit-job/:jobId"
                element={<AdminRoute><AuthenticatedLayout><AdminEditJobPage /></AuthenticatedLayout></AdminRoute>}
              />

              {/* Public and guest-accessible routes */}
              <Route
                path="/home"
                element={<GuestOrAuthenticatedRoute><Home /></GuestOrAuthenticatedRoute>}
              />
              <Route
                path="/jobs/:id"
                element={<GuestOrAuthenticatedRoute><JobDetails /></GuestOrAuthenticatedRoute>}
              />

              {/* Public routes with the simple layout */}
              <Route path="/" element={<Layout><UserTypeSelection /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/signup" element={<Layout><Signup /></Layout>} />
              <Route path="/employer/login" element={<Layout><EmployerLogin /></Layout>} />
              <Route path="/employer/signup" element={<Layout><EmployerSignup /></Layout>} />
              <Route path="/about" element={<Layout><div className="p-4 max-w-4xl mx-auto"><h1 className="text-2xl font-bold dark:text-gray-200">About</h1><p className="dark:text-gray-300">Learn more about Hunt-Career.</p></div></Layout>} />
              <Route path="/contact" element={<Layout><div className="p-4 max-w-4xl mx-auto"><h1 className="text-2xl font-bold dark:text-gray-200">Contact</h1><p className="dark:text-gray-300">Contact us at support@hunt-career.com.</p></div></Layout>} />
              <Route path="/privacy" element={<Layout><div className="p-4 max-w-4xl mx-auto"><h1 className="text-2xl font-bold dark:text-gray-200">Privacy Policy</h1><p className="dark:text-gray-300">Your privacy matters to us.</p></div></Layout>} />
              <Route path="*" element={<Layout><div className="p-4 text-center dark:text-gray-200">404 - Page Not Found</div></Layout>} />
            </Routes>
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