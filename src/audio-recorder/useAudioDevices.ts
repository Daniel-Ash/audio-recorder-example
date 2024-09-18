import { useState, useEffect } from "react";
import { RecordingStatus } from "./VoiceRecorder";

export function useAudioDevices(recordingStatus: RecordingStatus) {
	const [currentDeviceId, setCDId] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (window) {
			setCDId(localStorage.getItem('audioDeviceId') ?? undefined);
		}
	}, []);

	function setCurrentDeviceId(deviceId: string) {
		setCDId(deviceId);
		localStorage.setItem('audioDeviceId', deviceId);
	}

	const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
	useEffect(() => {
		if (recordingStatus === 'notStarted') return; //If user hasn't granted permission, this will stop the device/device list from being set to empty
		if (recordingStatus == 'idle') {
			const storedDeviceId = localStorage.getItem('audioDeviceId');
			// Populate device list
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) => {
					const audioDevices = devices.filter(
						(device) => device.kind === 'audioinput'
					);
					setDeviceList(audioDevices);
					setDeviceList(
						devices.filter((device) => device.kind === 'audioinput')
					);

					if (audioDevices.length > 0) {
						if (storedDeviceId) {
							const storedDevice = audioDevices.find(
								(device) => device.deviceId === storedDeviceId
							);
							if (storedDevice) {
								setCurrentDeviceId(storedDevice.deviceId);
								return;
							}
						}
						const deviceId = audioDevices[0].deviceId;
						setCurrentDeviceId(deviceId);
						return;
					}
				})
				.catch((err) => console.info(err));
		}
	}, [recordingStatus]);

	return { currentDeviceId, setCurrentDeviceId, deviceList };
}
