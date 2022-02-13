import { ref as databaseRef, onValue, update } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { auth, database, storage } from "./firebase";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";

const Session = () => {
	const audioPlayer = useRef<HTMLAudioElement>(null);
	const [joined, setJoined] = useState(false);
	const [isPublic, setPublic] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	useEffect(() => {
		update(
			databaseRef(database, "/sessions/" + window.location.pathname.slice(1)),
			{
				public: isPublic,
			}
		);
	}, [isOwner]);
	useEffect(() => {
		audioPlayer.current?.load();
		let user = "";
		signInAnonymously(auth).then(({ user: { uid } }) => {
			user = uid;
		});
		let loaded = false;
		if (audioPlayer.current) audioPlayer.current.volume = 0.1;
		const sessionId = window.location.pathname.slice(1);

		onValue(databaseRef(database, "/sessions/" + sessionId), (snapshot) => {
			if (!snapshot.exists()) {
				window.location.pathname = "/";
				return;
			}
			const sessionData = snapshot.val();
			if (!loaded) {
				if (sessionData.creator === user) setIsOwner(true);
				else setIsOwner(false);
				// Load file and save it into a butiful variable
				getDownloadURL(storageRef(storage, "audio/" + sessionId)).then(
					(url) => {
						if (audioPlayer.current) audioPlayer.current.src = url;
					}
				);
				loaded = true;
			}
			if (audioPlayer.current) {
				audioPlayer.current.currentTime = sessionData.currentTimestamp || 0;

				if (sessionData.isPlaying) {
					audioPlayer.current.play();
				} else {
					audioPlayer.current.pause();
				}
				audioPlayer.current.oncanplay = () => {
					if (!audioPlayer.current) return;
					if (sessionData.isPlaying && audioPlayer.current.paused) {
						audioPlayer.current.play();
					} else if (!sessionData.isPlaying && !audioPlayer.current.paused) {
						audioPlayer.current.pause();
					}
				};
				audioPlayer.current.onplay = () => {
					if (sessionData.isPlaying === false) {
						update(databaseRef(database, "/sessions/" + sessionId), {
							isPlaying: true,
							currentTimestamp: audioPlayer.current?.currentTime,
						});
					}
				};

				audioPlayer.current.onpause = () => {
					if (sessionData.isPlaying) {
						update(databaseRef(database, "/sessions/" + sessionId), {
							isPlaying: false,
							currentTimestamp: audioPlayer.current?.currentTime,
						});
					}
				};
			}
		});
	}, []);
	return (
		<div className="text-white p-8 w-screen h-screen flex justify-center items-center">
			<div className={joined ? "flex gap-4" : "hidden"}>
				<audio controls ref={audioPlayer} loop />
				{isOwner ? (
					<div className="flex flex-col justify-between">
						<div
							className={
								"cursor-pointer mt-0 relative rounded-full w-12 h-6 transition duration-200 ease-linear " +
								(isPublic ? "bg-green-400" : "bg-gray-400")
							}
						>
							<label
								htmlFor="toggle"
								className={
									"absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer " +
									(isPublic
										? "translate-x-full border-green-400"
										: "translate-x-0 border-gray-400")
								}
							/>
							<input
								type="checkbox"
								id="toggle"
								name="toggle"
								className="appearance-none w-full h-full active:outline-none focus:outline-none"
								onClick={() => setPublic(!isPublic)}
							/>
						</div>
						<h1>Public</h1>
					</div>
				) : (
					false
				)}
			</div>
			<button
				onClick={() => {
					setJoined(true);
				}}
				className={
					"p-4 bg-blue-500 hover:bg-blue-600 w-32 " + (joined ? "hidden" : "")
				}
			>
				Join
			</button>
		</div>
	);
};

export default Session;
