const video = document.getElementById("camera");
const startCamera = document.getElementById("startCamera");
const detectMood = document.getElementById("detectMood");

startCamera.addEventListener("click", async () => {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

    } catch (error) {
        alert("Camera access denied or unavailable.");
        console.error(error);
    }

});

detectMood.addEventListener("click", () => {
    window.location.href = "/result";
});