// utils/otpLogin.js
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase/auth';

export const setupRecaptcha = (phoneNumber, setVerificationId) => {
  const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
  });

  return signInWithPhoneNumber(auth, phoneNumber, verifier)
    .then((confirmationResult) => {
      setVerificationId(confirmationResult.verificationId);
    });
};
