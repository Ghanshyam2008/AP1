let mediaRecorder;
let recordedChunks = [];

function startRecording() {
  if (!bottleImage || !mouthVideo.src || !scriptInput.value.trim()) {
    alert("Please upload bottle image, mouth video, and enter subtitle text before recording.");
    return;
  }

  const stream = canvas.captureStream(30);
  recordedChunks = [];

  try {
    mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp8" });
  } catch (e) {
    alert("MediaRecorder not supported in your browser.");
    return;
  }

  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "talking_bottle.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  mediaRecorder.start();

  startAnimation();

  const seconds = parseFloat(durationInput.value);
  if (isNaN(seconds) || seconds <= 0) {
    mediaRecorder.stop();
    return;
  }

  setTimeout(() => {
    mediaRecorder.stop();
  }, (seconds * 1000) + 500);
}