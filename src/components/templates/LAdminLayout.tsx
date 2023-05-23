import React, { FC, PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ALink from "../atoms/ALink";
import { collection, getDocs, query, where } from "firebase/firestore";

// { user?.email}
const LAdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const getUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      if(data?.role !== 'admin') {
        navigate("/");
      }
    }
    catch(err){
      console.error(err);
    }
  }

  useEffect(() => {
    if (loading) return;
    if (!user || error) return navigate("/");
    getUserName();
  }, [loading, user]);

  return (
    <>
      <nav className="fixed left-0 w-40 h-screen bg-blue-600 top-0 flex flex-col py-6">
        <div className="text-center">{user?.displayName}</div>
        <div className="text-center">{user?.email}</div>
        <ALink to="/dashboard">Home</ALink>
        <ALink to="/admin">Main</ALink>
        <ALink to="/admin/users">Users</ALink>
        <ALink to="/admin/sections">Section</ALink>
        <ALink to="/admin/user-groups">User groups</ALink>
        <div className="text-center py-8" role="button" onClick={() => logout()}>
          Logout
        </div>
      </nav>

      <main className="w-screen pl-48 pr-8">{children}</main>
    </>
  );
};

export default LAdminLayout;
