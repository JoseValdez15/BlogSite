// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
// // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-1hIwTfi2RFHXCtQOw98TGn-jH4fVMfU",
  authDomain: "blogging-website-e73c8.firebaseapp.com",
  projectId: "blogging-website-e73c8",
  storageBucket: "blogging-website-e73c8.appspot.com",
  messagingSenderId: "405540508561",
  appId: "1:405540508561:web:6f43607a44fcb032280030"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

const logoutUser = () =>{
  auth.signOut();
  location.reload();
  // sessionStorage.clear();
}
