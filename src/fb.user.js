import { initializeApp } from "firebase/app";
import {
    getAuth,
    updateProfile,
    signOut
} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAuT7owM2lF6JqmWUionKIM1vQ2pOHgzRM",
    authDomain: "my-oasis-tech.firebaseapp.com",
    projectId: "my-oasis-tech",
    storageBucket: "my-oasis-tech.appspot.com",
    messagingSenderId: "180046491267",
    appId: "1:180046491267:web:f184a60c760b8c0eb375b6",
    measurementId: "G-WJZGXF8F3L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const clarifyError = (text) => {
    text = text.toString();
    const result = {type: "error", action: "", data: ""};
    if (text.includes('auth/email-already-in-use')) {
        return (result.action = "email") && (result.data = "This email is already in use") && result;
    } else if (text.includes('auth/operation-not-allowed')) {
        return (result.action = "console") && (result.data = "This operation is not allowed") && result;
    } else if (text.includes('auth/invalid-email')) {
        return (result.action = "email") && (result.data = "This email is invalid") && result;
    } else if (text.includes('auth/wrong-password')) {
        return (result.action = "password") && (result.data = "This password is incorrect") && result;
    } else if (text.includes('auth / user - not - found')) {
        return (result.action = "email") && (result.data = "This user does not exist") && result;
    } else if (text.includes('')) {
        return (result.action = "") && (result.data = "") && result;
    } else {
        console.log(text);
        return (result.action = "toast") && (result.data = text) && result;
    }
};

const updateUserProfile = async (user, {
    phoneNumber = "",
    displayName = "",
    photoURL = "",
}) => {
    try {
        await updateProfile(user, {
            displayName: displayName,
            photoURL: photoURL,
            phoneNumber: phoneNumber,
        });
        return {
            type: "success",
            action: "profile-update",
            data: user,
        };
    } catch (err) {
        console.error(err);
        return clarifyError(err);
    }
};

const logout = async () => {
    await signOut(auth);
};

export {
    db,
    auth,
    updateUserProfile,
    logout,
    clarifyError,
};