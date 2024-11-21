// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTSqKCOvAe1V0n3Lo2SIwA12r3voB6o8A",
  authDomain: "dynamicgridauthentication.firebaseapp.com",
  projectId: "dynamicgridauthentication",
  storageBucket: "dynamicgridauthentication.firebasestorage.app",
  messagingSenderId: "474892875381",
  appId: "1:474892875381:web:c4264ca7f4a63812e16a3c",
  measurementId: "G-V016PKHVG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig;