
import { initializeApp, setLogLevel } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyCElPv0S6cwXT2bKoGtfhvnwpZKrSV17ok",
  authDomain: "sahayak-ai-464506.firebaseapp.com",
  projectId: "sahayak-ai-464506",
  storageBucket: "sahayak-ai-464506.appspot.com",
  messagingSenderId: "839930043895",
  appId: "1:839930043895:web:4d4786b0c0fdde8df662f2",
  measurementId: "G-ZXPSVLPPTJ"
};

// Set log level to 'silent' to suppress informational messages from the
// Firestore backend, such as connection status warnings. This behavior is
// expected during offline startup and is handled by the app's persistence logic.
// Hiding these warnings provides a cleaner console experience for developers.
setLogLevel('silent');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable offline persistence. This allows Firestore to work locally
// even when the user is offline.
enableIndexedDbPersistence(db)
  .catch((err) => {
    // We still want to log genuine persistence setup problems.
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn("Firestore persistence failed: Multiple tabs open. Offline functionality may be limited.");
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence.
      console.warn("Firestore persistence is not supported in this browser. Offline functionality will not be available.");
    }
  });
