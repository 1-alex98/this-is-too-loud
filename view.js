let $ = require('jquery')  // jQuery now loaded and assigned to $
import {startRecording} from "./meter.js";
let volumeWrapper = startRecording();

$('#record-min').on('click', () => {
    onRecordMin()
})
$('#record-max').on('click', () => {
    onRecordMax()
})

let minRecordedLevel= -1
let maxRecordedLevel= -1

$('#speak-max').hide()
$('#speak-min').hide()
$('#recording-max').hide()
$('#recording-min').hide()
$('#recorded-max').hide()
$('#recorded-min').hide()
$("#status").hide();
$("#switchWarning").prop("disabled",true);

function onRecordMax(){
    $('#speak-max').show()
    $('#recording-max').show()
    $('#no-max').hide()
    $('#record-max').prop("disabled",true);

    function onRecordedMax() {
        let number = volumeWrapper.rollingAverage;
        maxRecordedLevel = number;
        $('#record-max').prop("disabled",false);
        $('#record-max').text("Record again")
        $('#recording-max').hide()
        $('#speak-max').hide()
        $('#recorded-max').text(`Here: ${number.toFixed(1)}`);
        $('#recorded-max').show();
        if(minRecordedLevel !== -1 && maxRecordedLevel!== -1) {
            $("#record-missing").hide()
            $("#switchWarning").prop("disabled",false);
        }
    }

    setTimeout(onRecordedMax, 5000);
}

function onRecordMin(){
    $('#speak-min').show()
    $('#recording-min').show()
    $('#no-min').hide()
    $('#record-min').prop("disabled",true);

    function onRecordedmin() {
        let number = volumeWrapper.rollingAverage;
        minRecordedLevel = number;
        $('#record-min').prop("disabled",false);
        $('#record-min').text("Record again")
        $('#recording-min').hide()
        $('#speak-min').hide()
        $('#recorded-min').text(`Here: ${number.toFixed(1)}`);
        $('#recorded-min').show();
        if(minRecordedLevel !== -1 && maxRecordedLevel!== -1){
            $("#record-missing").hide()
            $("#switchWarning").prop("disabled",false);
        }
    }

    setTimeout(onRecordedmin, 5000);
}


function redAlert() {
    const audio = new Audio("red.mp3");
    audio.play();
}

function orangeAlert() {
    const audio = new Audio("orange.wav");
    audio.play();
}

function check() {
    if(!document.getElementById("switchWarning").checked){
        return;
    }
    let rollingAverage = volumeWrapper.rollingAverage;
    if(rollingAverage> maxRecordedLevel){
        redAlert()
        setStatus("red")
    }else if(rollingAverage > ((maxRecordedLevel + minRecordedLevel) /2)){
        orangeAlert();
        setStatus("orange")
    }else {
        setStatus()
    }
}

function setStatus(status){
    $("#status").show()
    const statusIcon = $("#status");
    statusIcon.removeClass("text-success")
    statusIcon.removeClass("text-warning")
    statusIcon.removeClass("text-danger")
    if(status === "red"){
        statusIcon.addClass("text-danger")
    }else if(status === "orange"){
        statusIcon.addClass("text-warning")
    }else {
        statusIcon.addClass("text-success")
    }
}

setInterval(check, 4000); // one hour check.