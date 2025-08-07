import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import MainLayout from "./layout/MainLayout";
import Address from "./features/address/Address";
import AddressList from "./features/address/AddressList";
import Test from "./features/test/test";
import FileUpload from "./features/uploadFile/FileUpload";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/add-user"
          element={
            <MainLayout>
              <UserForm />
            </MainLayout>
          }
        />
        <Route
          path="/edit-user/:id"
          element={
            <MainLayout>
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/add-address"
          element={
            <MainLayout>
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/address-list"
          element={
            <MainLayout>
              <ProtectedRoute>
                <AddressList />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/upload-file"
          element={
            <MainLayout>
              <ProtectedRoute>
                <FileUpload />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}
export default App;
