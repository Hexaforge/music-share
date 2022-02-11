import React, { useState } from "react";
import { storage } from "./firebase";
import { database } from "./firebase";
import { ref as storeRef, uploadBytes } from "firebase/storage";
import { set, ref as databaseRef } from "firebase/database";

const App = () => {
	const [loading, setLoading] = useState(false);
	const uploadFile = (file: File) => {
		setLoading(true);
		const id = Math.random().toString(32).slice(2);
		if (!file) return;
		const storageRef = storeRef(storage, "audio/" + id);
		let dbDone = false;
		let storeDone = false;
		uploadBytes(storageRef, file).then((snapshot) => {
			storeDone = true;
			if (dbDone) {
				setLoading(false);
				window.location.pathname = "/" + id;
			}
		});
		set(databaseRef(database, "sessions/" + id), {
			currentTimestamp: 0,
			isPlaying: false,
		}).then((data) => {
			dbDone = true;
			if (storeDone) {
				setLoading(false);
				window.location.pathname = "/" + id;
			}
		});
	};
	return (
		<div className="bg-slate-900 w-screen h-screen flex justify-center items-center p-32">
			<div className="w-full text-white text-3xl file:hidden bg-slate-800 border-dashed border-2 border-slate-500 flex justify-center items-center">
				{loading ? (
					<div className="p-36 animate-spin text-9xl text-center">◡</div>
				) : (
					<input
						onChange={({ target: { files } }) => {
							if (!files) return;
							uploadFile(files[0]);
						}}
						type="file"
						title="Upload a file"
						itemType="audio/*"
						accept="audio/*"
						className="file:hidden p-36 outline-none"
					/>
				)}
			</div>
		</div>
	);
};

export default App;
