// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCwrwy4RTVouz-I1WRgoOEfvA-wv7ndHFU",
	authDomain: "musicash-6cdeb.firebaseapp.com",
	databaseURL:
		"https://musicash-6cdeb-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "musicash-6cdeb",
	storageBucket: "musicash-6cdeb.appspot.com",
	messagingSenderId: "824474383774",
	appId: "1:824474383774:web:62af15dea98936dcf8928f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app, "gs://musicash-6cdeb.appspot.com");

export const database = getDatabase(app);

export const auth = getAuth(app);
