// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDoSP-TIg_kvEPcBi4sydg9ttefvckFUIU",
	authDomain: "musicshare2-aa00f.firebaseapp.com",
	databaseURL:
		"https://musicshare2-aa00f-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "musicshare2-aa00f",
	storageBucket: "musicshare2-aa00f.appspot.com",
	messagingSenderId: "902499158091",
	appId: "1:902499158091:web:b4bd97a2fe4d38ca93e5ce",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app, "gs://" + app.options.storageBucket);

export const database = getDatabase(app);

export const auth = getAuth(app);
