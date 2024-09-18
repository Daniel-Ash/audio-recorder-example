export async function transcribe(blob: globalThis.Blob, prompt?: string) {
	const data = new FormData();
	data.append("model", "whisper-1");
	data.append("file", blob, "recording.mp3");
	if (prompt) {
		data.append("prompt", prompt);
	}

	const url = process.env["NEXT_PUBLIC_API_BASE_URL"];

	if (url) {
		return { text: "Hello world" };
		// const response = await fetch(`${url}/voice`, {
		// 	method: "POST",
		// 	body: data,
		// });

		// if (response.ok) {
		// 	const data: { text: string } = await response.json();
		// 	return data;
		// }
		// throw new Error("Failed to fetch transcription");
	}
	throw new Error("NEXT_PUBLIC_API_BASE_URL not set");
}
