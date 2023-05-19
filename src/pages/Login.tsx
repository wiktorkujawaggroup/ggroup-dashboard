import React, { useEffect } from 'react'
import { auth, signInWithGoogle } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router';
// type Props = {}

const Login = () => {

  const [ user, loading, error ] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if(loading) {
      return;
    }
    if(user) {
      navigate("/dashboard")
    }
  }, [user, loading, navigate])

  return (
    <div className='w-screen mx-auto text-center'>
      {/* <h1>Sign In</h1> */}
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

export default Login