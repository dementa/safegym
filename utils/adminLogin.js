// utils/adminLogin.js
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/auth';

export const adminLogin = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
