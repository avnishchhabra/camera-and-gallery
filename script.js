const video = document.querySelector("video");
const recordBtnCont = document.querySelector(".record-btn-cont");
const captureBtnCont = document.querySelector(".capture-btn-cont");
const recordBtn = document.querySelector(".record-btn");
const captureBtn = document.querySelector(".capture-btn");
const timer = document.querySelector(".timer");
let recorder;
let recording = false;
let chunks = [];
let interval;
const constraints = {
  video: true,
  audio: true,
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  console.log("stram", stream);
  video.srcObject = stream;
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  recorder.onstart = () => {
    chunks = [];
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    const videoUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "stream.mp4";
    a.click();
  };
});

recordBtnCont.addEventListener("click", () => {
  if (!recorder) {
    console.log("recorder not ready");
    return;
  }

  recording = !recording;

  if (recording) {
    // start recording
    recordBtn.classList.add("scale-record");
    recorder.start();
    startTimer();
  } else {
    // stop recording
    recordBtn.classList.remove("scale-record");
    recorder.stop();
    stopTimer();
  }
});

captureBtnCont.addEventListener("click", () => {});

function stopTimer() {
  clearInterval(interval);
  timer.innerHTML = "00:00:00";
  timer.style.display = "none";
}

const convertSecondsToFormat = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secs = Math.floor((seconds - hours * 3600) % 60);
  const formattedValue = `${hours > 9 ? hours : `0${hours}`}:${
    minutes > 9 ? minutes : `0${minutes}`
  }:${secs > 9 ? secs : `0${secs}`}`;

  timer.innerHTML = formattedValue;
};

function startTimer() {
  timer.style.display = "block";
  let seconds = 0;

  interval = setInterval(() => {
    seconds++;
    convertSecondsToFormat(seconds);
  }, 1000);
}
