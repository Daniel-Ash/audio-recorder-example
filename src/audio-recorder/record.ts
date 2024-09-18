import type RecordRTC from "recordrtc";
import UAParser from "ua-parser-js";

export async function initUserMedia(deviceId: string | undefined) {
	const options: MediaStreamConstraints = {
		audio: {
			deviceId: deviceId,
			sampleRate: 8000,
			channelCount: 1,
			noiseSuppression: true,
		},
		video: false,
	};

	console.info("initiating stream with device id: ", deviceId);

	const stream = await navigator.mediaDevices.getUserMedia(options);
	return stream;
}

export async function initRecordRtc(stream: MediaStream) {
	const { default: RecordRTC } = await import("recordrtc"); //must dynamic import or else it will break next.js because SSR..

	let options: RecordRTC.Options;

	const uaParser = new UAParser();
	const result = uaParser.setUA(navigator.userAgent).getResult();

	if (result.os.name === "iOS") {
		options = {
			type: "audio",
			mimeType: "audio/wav",
			recorderType: RecordRTC.StereoAudioRecorder,
		};
	} else if (result.browser.name === "Opera") {
		throw new Error("Opera is not supported yet."); //opera only supports OGG, which openai doesn't allow
	} else {
		options = {
			type: "audio",
			mimeType: "audio/webm",
			recorderType: RecordRTC.MediaStreamRecorder,
		};
	}

	return new RecordRTC(stream, options);
}
