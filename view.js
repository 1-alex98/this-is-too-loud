import {startRecording} from "./meter.js";

Array.prototype.average = function () {
    return this.reduce((a,b) => a+b, 0) / this.length;
}

Array.prototype.clear = function () {
    this.splice(0, this.length);
}

let volumeWrapper = startRecording();
let slider = document.getElementById("rangeSlider");
const handleBar = document.getElementById("volumePreview");

const queue = [];

let playsAudio = false;
let threshold;

window.requestAnimationFrame(render);

function render() {
    const min = 10;
    const max = 100;

    let fraction = Math.max(0, (volumeWrapper.volume - min) / (max - min) * 100);
    threshold = slider.value / 100 * (max - min) + min;

    let darker = "#58fa72";
    let brighterOk = "#eee";
    let brighterWarn = "#ea9999";
    if (volumeWrapper.volume > threshold) {
        darker = "#f64b4b";
    }

    handleBar.style.backgroundImage = "-webkit-linear-gradient(0deg, " + darker + " " + fraction + "%, " + brighterOk + " " + fraction + "%, "+ brighterOk+" "+ slider.value +"%, "+brighterWarn+" "+slider.value +"% )";

    window.requestAnimationFrame(render);
}

setInterval(function () {
    queue.push(volumeWrapper.volume);

    if (queue.length > 20) {
        queue.shift();
    }

    if(queue.length === 20 && queue.average() > threshold && !playsAudio) {
        const audio = new Audio("red.mp3");
        audio.play();
        playsAudio = true;
        audio.onended = function () {
            playsAudio = false;
        }
    }
}, 50);