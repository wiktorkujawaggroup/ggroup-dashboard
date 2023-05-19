// import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import LLayout from "./components/templates/LLayout";
import Drive from "./pages/Drive";
import Bitwarden from "./pages/Bitwarden";
import HRNest from "./pages/HRNest";

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
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
