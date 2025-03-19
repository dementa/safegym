import React from 'react';
import { create } from 'zustand';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from "../firebaseConfig"
import { addDoc, collection, getDoc, doc, setDoc, updateDoc } from "firebase/firestore"
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export const useAuthStore = create((set, get ) => ({
  email: '',
  phone: '',
  password: '',
  pwd: '',
  username: '',
  role: 'user',
  loading: false,
  showPassword: false,
  errorMsg: null,
  
  setEmail: (email) => set({ email }),
  setPwd: (pwd) => set({ pwd }),
  setPassword: (password) => set({ password }),
  setUsername: (username) => set({ username }),
  setPhone: (phone) => set({ phone }),
  removeError: (errorMsg) => set({ errorMsg: null }),
  setErrorMsg: (errorMsg) => set({errorMsg, loading: false}),
  togglePasswordVisibility: () => set((state) => ({ showPassword: !state.showPassword })),

  // Login logic
  login: async (navigation) => {
    set({ loading: true });

    const {redirect} = get();

    try {
        // Sign in the user with email and password
        const userCredential = await signInWithEmailAndPassword(auth, get().email, get().password);
        const user = userCredential.user;

        // Fetch user details from Firestore using the user's UID
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            const updates = {};

            if( !userData.username) updates.username = user.displayName || "";
            console.log(user.displayName)

            // Update the document if updates available
            if(Object.keys(updates).length > 0){
              await updateDoc(userRef, updates);
            }

            // Set the user's first name and last name in the Zustand store
            set({
                username: userData.username,
                email: userData.email, // Clear email after login
                password: '', // Clear password after login
                role: userData.role,
                loading: false,
                showPassword: false,
            });

            navigation.replace("MainApp");
        } else {
            console.error('No user data found in Firestore for this UID.');
            set({ loading: false });
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        set({ loading: false, errorMsg: error.message }); // Set error message in the store
    }
  },

  verifyPassword: () => {
      const { password, pwd } = get();
      if(password === ""){
        set({errorMsg: "Enter password first to confirm it"})
        return;
      } else if( password !== pwd ){
        set({errorMsg: "Passwords do not match."})
        return;
      }
    },

  resetFields: () => {
    set({
      email: '',
      phone: '',
      password: '',
      pwd: '',
      username: '',
      showPassword: false,
    })
  },

  createAccount: (navigation) => {
    set({loading: false})
    const {email, phone, username, password, setErrorMsg, verifyPassword, registerUser} = get();
    const isEmpty = (value) => {
      return value === "" ? true : false;
    };

    if(isEmpty(email) && isEmpty(phone)){
      setErrorMsg("Provide an email address or phone number to continue.");
    } else {
      try {
        verifyPassword();

        registerUser();

        navigation.replace("Login", { Msg: "Thanks for choosing us"});
      } catch (error) {
        setErrorMsg(`Error:  ${error}`)
      }
    }
  },

  registerUser:  async () => {
    set({ loading: true });
    const { email, phone, username, password, setErrorMsg, resetFields } = get();

    try {
        // Check if the user is registering with email
        if (email) {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, 'users', user.uid);

            // Store user data in Firestore
            await setDoc(userRef, {
                uid: user.uid, // Store the user's UID
                email,
                phone: phone || "", // Store phone if provided, else empty string
                username: username || "", // Default value if not provided
                role: 'user'
            });

            resetFields();
            setErrorMsg("User created successfully");
        } else if (phone) {
            // If only phone is provided, you can still create a user in Firestore
            if(username === ""){
              setErrorMsg("Both names are required please!")
            }else{
              try {
                await addDoc(collection(db, 'users'), {
                  email: '', // No email provided
                  phone,
                  username: username || "", // Default value if not provide
                  password,// You might want to handle password differently for phone registration
                  role: 'user'
                });
              } catch (error) {
                setErrorMsg(`Something went wrong: ${error.message}`)
                return;
              }
            }
            resetFields();
            setErrorMsg("User  created successfully with phone number");
        } else {
            setErrorMsg("Please provide either an email or a phone number.");
        }
      } catch (error) {
          setErrorMsg(`Something went wrong!: ${error.message}`);
      }
  }
}));
