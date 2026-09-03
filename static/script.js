const video = document.getElementById("camera");
const startCamera = document.getElementById("startCamera");
const detectMood = document.getElementById("detectMood");
const moodOutput = document.getElementById("mood");
const songOutput = document.getElementById("song");
const resultPanel = document.querySelector(".result");
const songPanel = document.querySelector(".song");
const musicPlayer = document.getElementById("musicPlayer");
const modelUrl = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
let cameraReady = false;
let detectorReady = false;
let introAudioContext;

const moodSongs = {
    happy: {
        title: "😊 HAPPYYYYY",
        audio: "/static/audio/happy.mp3"
    },
    sad: {
        title: "🌧️ SADDDDD",
        audio: "/static/audio/sad.mp3"
    },
    angry: {
        title: "🔥ANGRYYYY",
        audio: "/static/audio/angry.mp3"
    },
    romantic: {
        title: "😴TIREDDDD",
        audio: "/static/audio/tired.mp3"
    },
    tired: {
        title: "😴TIREDDDD",
        audio: "/static/audio/tired.mp3"
    }
};

detectMood.disabled = true;

function playIntroTune() {
    introAudioContext = introAudioContext || new AudioContext();
    const notes = [523.25, 659.25, 783.99, 659.25, 880];
    const startTime = introAudioContext.currentTime;

    notes.forEach((frequency, index) => {
        const oscillator = introAudioContext.createOscillator();
        const gain = introAudioContext.createGain();
        const noteStart = startTime + index * 0.16;

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.14);
        oscillator.connect(gain);
        gain.connect(introAudioContext.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.15);
    });
}

async function loadMoodDetector() {
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
    await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl);
    detectorReady = true;
    detectMood.textContent = "Detect Mood";
    if (cameraReady) {
        detectMood.disabled = false;
    }
}

loadMoodDetector().catch((error) => {
    detectMood.textContent = "Mood detector unavailable";
    console.error(error);
});

startCamera.addEventListener("click", async () => {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;
        playIntroTune();
        cameraReady = true;
        if (detectorReady) {
            detectMood.disabled = false;
        }
        startCamera.textContent = "Camera Ready";

    } catch (error) {
        alert("Camera access denied or unavailable.");
        console.error(error);
    }

});

detectMood.addEventListener("click", async () => {
    detectMood.disabled = true;
    detectMood.textContent = "Preparing camera...";

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (!video.videoWidth || !video.videoHeight) {
        moodOutput.textContent = "Camera is not ready - try again";
        detectMood.disabled = false;
        detectMood.textContent = "Detect Mood";
        return;
    }

    detectMood.textContent = "Reading your mood...";

    let detection;
    try {
        detection = await faceapi.detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();
    } catch (error) {
        moodOutput.textContent = "Mood detection failed - try again";
        console.error(error);
        detectMood.disabled = false;
        detectMood.textContent = "Detect Mood";
        return;
    }

    if (!detection) {
        moodOutput.textContent = "No face detected - look at the camera";
        detectMood.disabled = false;
        detectMood.textContent = "Detect Mood";
        return;
    }

    const expressions = detection.expressions;
    const detectedMood = expressions.happy >= 0.55
        ? "happy"
        : expressions.sad >= 0.45
            ? "sad"
            : expressions.angry >= 0.45
                ? "angry"
                : expressions.disgusted >= 0.35 || expressions.fearful >= 0.35
                    ? "tired"
                    : "romantic";
    const recommendation = moodSongs[detectedMood];

    moodOutput.textContent = detectedMood;
    songOutput.textContent = recommendation.title;
    musicPlayer.src = recommendation.audio;
    musicPlayer.load();
    musicPlayer.play().catch(() => {
        songOutput.textContent = `${recommendation.title} - press play to start`;
    });

    resultPanel.hidden = false;
    songPanel.hidden = false;
    resultPanel.classList.remove("is-visible");

    requestAnimationFrame(() => {
        resultPanel.classList.add("is-visible");
    });

    detectMood.disabled = false;
    detectMood.textContent = "Detect Mood Again";
});

musicPlayer.addEventListener("error", () => {
    songOutput.textContent = "MP3 file missing: add the matching file to static/audio/";
});