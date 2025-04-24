import { signInWithPopup, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import {db, auth} from '../firebase/firebaseConfig';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";


export const signInWithGoogle = async (navigation) =>{
    const googleProvider = new GoogleAuthProvider();

    const userCridentials = await signInWithPopup(auth, googleProvider);
    const user = userCridentials.user

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if(!userDoc.exists()){
        const userData = userDoc.data();
        
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            phone: user.phoneNumber || "",
            username: user.displayName || "",
            password: "Hackme256@",
            role: "user"
        })
    }

    if(role === 'user') navigation.replace('MainApp')
    if(role === 'trainner') navigation.replace('')
}

export const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    webClientId: "989228136128-7qf5f71tcgn36updhs30469ake171852.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("User signed in:", userCredential.user);
        })
        .catch((error) => {
          console.error("Google Sign-In Error:", error);
        });
    }
  }, [response]);

  return { promptAsync };
};

