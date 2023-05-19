import { getApps, initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { apps } from 'firebase-admin';

const isDev = import.meta.env.VITE_NODE_ENV === 'development';

const firebaseConfigs = {
  apiKey: isDev
    ? import.meta.env.VITE_FIREBASE_DEV_API_KEY
    : import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: isDev
    ? import.meta.env.VITE_FIREBASE_DEV_AUTH_DOMAIN
    : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: isDev
    ? import.meta.env.VITE_FIREBASE_DEV_PROJECT_ID
    : import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: isDev
    ? import.meta.env.VITE_FIREBASE_DEV_STORAGE_BUCKET
    : import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: isDev
    ? import.meta.env.VITE_FIREBASE_DEV_MESSAGING_SENDER_ID
    : import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: isDev
    ? import.meta.env.VITE_FIREBASE_DEV_APP_ID
    : import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: isDev
    ? import.meta.env.VITE_FIREBASE_DEV_MEASUREMENT_ID
    : import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// if (!getApps().length) {
  const app = initializeApp(firebaseConfigs);
// }
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid","==", user.uid));
    const docs = await getDocs(q);
    if(!docs.docs.length) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name:user.displayName,
        authProvider: "google",
        email: user.email
      });
    }
  }
  catch(err) {
    console.error(err);
    alert(err);
  }
};

const logout = () => {
  signOut(auth)
}


export { db, auth, storage, signInWithGoogle, logout };