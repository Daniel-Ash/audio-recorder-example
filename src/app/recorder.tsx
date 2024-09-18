"use client";
import VoiceRecorder from "@/audio-recorder/VoiceRecorder";

export default function Recorder() {
	return (
		<VoiceRecorder
			onTranscribe={function (text: string): void {
				throw new Error("Function not implemented.");
			}}
			prompt={""}
		/>
	);
}
