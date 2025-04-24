// utils/verifyOTP.js
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase/auth';

export const verifyOTP = async (verificationId, code) => {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  return signInWithCredential(auth, credential);
};
