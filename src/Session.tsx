import {
	child,
	get,
	set,
	ref as databaseRef,
	onValue,
} from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { database, storage } from "./firebase";
import { ref as storageRef, getDownloadURL } from "firebase/storage";

const Session = () => {
	const audioPlayer = useRef<HTMLAudioElement>(null);

	useEffect(() => {
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
				audioPlayer.current.onplay = () => {
					if (sessionData.isPlaying === false) {
						set(databaseRef(database, "/sessions/" + sessionId), {
							isPlaying: true,
							currentTimestamp: audioPlayer.current?.currentTime,
						});
					}
				};

				audioPlayer.current.onpause = () => {
					if (sessionData.isPlaying) {
						set(databaseRef(database, "/sessions/" + sessionId), {
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
			<audio controls ref={audioPlayer} loop />
		</div>
	);
};

export default Session;
