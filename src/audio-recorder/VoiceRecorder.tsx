"use client";
import { useRef, useState } from "react";
import type RecordRTC from "recordrtc";
import { initRecordRtc, initUserMedia } from "./record";
import { transcribe } from "./transcribe";
import {
	CheckCircleIcon,
	EllipsisHorizontalIcon,
	MicrophoneIcon,
	XCircleIcon,
} from "@heroicons/react/24/solid";
import RecorderSettings from "./RecorderSettings";
import RecorderInterface from "./RecorderInterface";
import { useAudioDevices } from "./useAudioDevices";

export type RecordingStatus =
	| "notStarted"
	| "idle"
	| "recording"
	| "loading"
	| "success"
	| "error";

export default function VoiceRecorder({
	onTranscribe,
	prompt,
}: {
	onTranscribe: (text: string) => void;
	prompt: string;
}) {
	const [status, setStatus] = useState<RecordingStatus>("notStarted");
	const recorder = useRef<RecordRTC | undefined>(undefined);
	const stream = useRef<MediaStream | undefined>(undefined);
	const { currentDeviceId, setCurrentDeviceId } = useAudioDevices(status);

	async function record() {
		try {
			setStatus("loading");

			const newStream = await initUserMedia(currentDeviceId);
			stream.current = newStream;
			recorder.current = await initRecordRtc(newStream);
			recorder.current.startRecording();
			setStatus("recording");
		} catch (error) {
			setStatus("error");
		}
	}

	function stopRecording() {
		recorder.current?.stopRecording(() => {
			setStatus("loading");
			const blob = recorder.current?.getBlob();

			if (blob) {
				transcribe(blob, prompt)
					.then((data) => {
						setStatus("success");
						setTimeout(() => {
							setStatus("idle");
						}, 500);

						return onTranscribe(data.text);
					})
					.catch((error) => {
						setStatus("error");
						setTimeout(() => {
							setStatus("idle");
						}, 500);
						return;
					});
			}
		});

		stream.current?.getTracks().forEach((track) => track.stop());
	}

	switch (status) {
		case "notStarted":
			return (
				<RecorderInterface
					Microphone={
						<button onClick={record} type="button">
							<MicrophoneIcon className="w-8 text-emerald-500 " />
						</button>
					}
					RecorderSettings={
						<RecorderSettings
							currentDeviceId={currentDeviceId}
							setCurrentDeviceId={setCurrentDeviceId}
							disabled
							recordingStatus={status}
						/>
					}
				/>
			);
		case "idle":
			return (
				<RecorderInterface
					Microphone={
						<button onClick={record} type="button">
							<MicrophoneIcon className="w-8 text-emerald-500 " />
						</button>
					}
					RecorderSettings={
						<RecorderSettings
							currentDeviceId={currentDeviceId}
							setCurrentDeviceId={setCurrentDeviceId}
							recordingStatus={status}
						/>
					}
				/>
			);
		case "recording":
			return (
				<RecorderInterface
					Microphone={
						<button
							onClick={stopRecording}
							className="relative text-red-600"
							type="button"
						>
							<MicrophoneIcon className=" w-8" />
							<div className="absolute right-0 top-2 h-2 w-2 shrink-0 animate-ping rounded-full bg-red-600 motion-reduce:hidden">
								{" "}
							</div>
						</button>
					}
					RecorderSettings={
						<RecorderSettings
							currentDeviceId={currentDeviceId}
							setCurrentDeviceId={setCurrentDeviceId}
							recordingStatus={status}
							disabled
						/>
					}
				/>
			);
		case "loading":
			return (
				<RecorderInterface
					Microphone={
						<EllipsisHorizontalIcon className="w-8 animate-pulse text-text-light-dim dark:text-text-dark-dim" />
					}
					RecorderSettings={
						<RecorderSettings
							currentDeviceId={currentDeviceId}
							setCurrentDeviceId={setCurrentDeviceId}
							recordingStatus={status}
							disabled
						/>
					}
				/>
			);
		case "success":
			return (
				<RecorderInterface
					Microphone={
						<CheckCircleIcon className="w-8 text-emerald-500" />
					}
					RecorderSettings={
						<RecorderSettings
							currentDeviceId={currentDeviceId}
							setCurrentDeviceId={setCurrentDeviceId}
							recordingStatus={status}
							disabled
						/>
					}
				/>
			);
		case "error":
			return (
				<RecorderInterface
					Microphone={
						<button onClick={record}>
							<XCircleIcon className="w-8 text-red-500" />
						</button>
					}
					RecorderSettings={
						<RecorderSettings
							currentDeviceId={currentDeviceId}
							setCurrentDeviceId={setCurrentDeviceId}
							recordingStatus={status}
						/>
					}
				/>
			);
		default:
			const _exhaustiveCheck: never = status;
			throw new Error(`Unhandled status: ${_exhaustiveCheck}`);
	}
}
