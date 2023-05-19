import React, { FC, PropsWithChildren, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ALink from "../atoms/ALink";

// { user?.email}
const LLayout: FC<PropsWithChildren> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  // const [name, setName] = useState('');
  // const getUserName = async () => {
  //   try {
  //     const q = query(collection(db, "users"), where("uid", "==", user?.uid));
  //     const doc = await getDocs(q);
  //     const data = doc.docs[0].data();
  //     setName(data.name);
  //   }
  //   catch(err){
  //     console.error(err);
  //     alert("Error while fetching user data");
  //   }
  // }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    // getUserName();
  }, [loading, user]);

  return (
    <>
      <nav className="fixed left-0 w-40 h-screen bg-blue-600 top-0 flex flex-col py-20">
        <div className="text-center">{user?.displayName}</div>
        <div className="text-center mb-10">{user?.email}</div>
        <NavLink className={'hover:bg-white w-full py-8 text-center'} to="/dashboard">Home</NavLink>
        <ALink to="/dashboard/drive">Drive</ALink>
        <ALink to="/dashboard/bitwarden">Bitwarden</ALink>
        <ALink to="/dashboard/about">About</ALink>
        <ALink to="/dashboard/hrnest">HR Nest</ALink>
        <div className="text-center py-8" role="button" onClick={() => logout()}>
          Logout
        </div>
      </nav>

      <main className="w-full pl-48 pr-8">{children}</main>
    </>
  );
};

export default LLayout;
