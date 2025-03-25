import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ✅ Signup with Role
export const signUp = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store role in Firestore
    await setDoc(doc(db, "users", user.uid), { email, role });

    return user;
  } catch (error) {
    console.error("🔥 Signup Error:", error.message);
    return null;
  }
};

// ✅ Login with Role Retrieval
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch role from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { uid: user.uid, email: user.email, role: userSnap.data().role };
    } else {
      console.error("❌ No role found for user!");
      return null;
    }
  } catch (error) {
    console.error("🔥 Login Error:", error.message);
    return null;
  }
};
