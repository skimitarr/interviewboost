import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWvm0_0AFV5e3DNfYUNBD-RB10spR1I04",
  authDomain: "interviewquestions-9312a.firebaseapp.com",
  projectId: "interviewquestions-9312a",
  storageBucket: "interviewquestions-9312a.appspot.com",
  messagingSenderId: "721976051008",
  appId: "1:721976051008:web:0e7ecea19281c5353766a5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app
