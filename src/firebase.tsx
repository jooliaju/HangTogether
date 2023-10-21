// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQbn4G1mHLjINIE5jDz1_ZyfX4-K7ysl8",
  authDomain: "hangtogether-571c9.firebaseapp.com",
  projectId: "hangtogether-571c9",
  storageBucket: "hangtogether-571c9.appspot.com",
  messagingSenderId: "60242460305",
  appId: "1:60242460305:web:655155e824af87aa08c930",
  measurementId: "G-1W8YGKJ4QV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
