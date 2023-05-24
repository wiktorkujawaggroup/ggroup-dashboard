// import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/dashboard";
import Login from "./pages/Login";
import About from "./pages/dashboard/About";
import LLayout from "./components/templates/LLayout";
import LAdminLayout from "./components/templates/LAdminLayout";
import Drive from "./pages/dashboard/Drive";
import Bitwarden from "./pages/dashboard/Bitwarden";
import HRNest from "./pages/dashboard/HRNest";
import Admin from "./pages/admin";
import Users from "./pages/admin/Users";
import UserGroups from "./pages/admin/UserGroups";
import AddGroup from "./pages/admin/AddGroup";

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin" element={<LAdminLayout><Admin /></LAdminLayout>} />
        <Route path="/admin/users" element={<LAdminLayout><Users /></LAdminLayout>} />
        <Route path="/admin/user-groups" element={<LAdminLayout><UserGroups /></LAdminLayout>} />
        <Route path="/admin/add-group" element={<LAdminLayout><AddGroup /></LAdminLayout>} />

        
        
        {/* User routes */}
        <Route path="/dashboard" element={<LLayout><Home /></LLayout>} />
        <Route path="/dashboard/about" element={<LLayout><About /></LLayout>} />
        <Route path="/dashboard/drive" element={<LLayout><Drive /></LLayout>} />
        <Route path="/dashboard/bitwarden" element={<LLayout><Bitwarden /></LLayout>} />
        <Route path="/dashboard/hrnest" element={<LLayout><HRNest /></LLayout>} />



        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </>
  );
}

export default App;
