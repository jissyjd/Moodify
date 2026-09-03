const video = document.getElementById("camera");
const startCamera = document.getElementById("startCamera");
const detectMood = document.getElementById("detectMood");
const moodOutput = document.getElementById("mood");
const songOutput = document.getElementById("song");
const resultPanel = document.querySelector(".result");
const songPanel = document.querySelector(".song");
const musicPlayer = document.getElementById("musicPlayer");

const wrongSongs = {
    happy: {
        title: "Sad Violin - Emotional Version",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    sad: {
        title: "Crazy Party Dance Mix",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    angry: {
        title: "Cute Baby Lullaby",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    romantic: {
        title: "Gym Workout Motivation",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    tired: {
        title: "Ultra Fast EDM Party",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
};

detectMood.disabled = true;

startCamera.addEventListener("click", async () => {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;
        detectMood.disabled = false;
        startCamera.textContent = "Camera Ready";

    } catch (error) {
        alert("Camera access denied or unavailable.");
        console.error(error);
    }

});

detectMood.addEventListener("click", () => {
    const moods = Object.keys(wrongSongs);
    const detectedMood = moods[Math.floor(Math.random() * moods.length)];
    const recommendation = wrongSongs[detectedMood];

    moodOutput.textContent = detectedMood;
    songOutput.textContent = recommendation.title;
    musicPlayer.src = recommendation.audio;
    musicPlayer.load();
    musicPlayer.play().catch(() => {});

    resultPanel.hidden = false;
    songPanel.hidden = false;
    resultPanel.classList.remove("is-visible");

    requestAnimationFrame(() => {
        resultPanel.classList.add("is-visible");
    });
});