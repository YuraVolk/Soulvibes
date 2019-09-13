let videoPlays, isMute = true, prevVideoVolume;
var styledRanges = document.getElementsByClassName('styled_range');
var rangeVideo = styledRanges[0].childNodes;


function toMinuteSecond(number) {
    number = parseInt(number, 10);

    var hours = Math.floor(number / 3600);
    var minutes = Math.floor((number - (hours * 3600)) / 60);
    var seconds = number - (hours * 3600) - (minutes * 60);

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return minutes + ':' + seconds;
}

function setVideoTime(time) {
    const video = document.querySelector('.video');

    video.currentTime = time;
    updateVideoTime();
}

function getVideoDuration() {
    const video = document.querySelector('.video');

    return video.duration;
}

function pauseVideo() {
    videoPlays = false;
    document.querySelector('.video').pause();
    document.querySelector('.video').classList.add('hidden');
}

function startVideo() {
    videoPlays = true;
    document.querySelector('.video').play();
    document.querySelector('.video').classList.remove('hidden');
}

function equalizeRange(videoTime, videoDuration, range) {
    range[3].value = videoTime * 100 / videoDuration;
    range[1].value = videoTime * 100 / videoDuration;
}

function modifyRange(audioRanges, isTime) {
    for (var i = 0; i < audioRanges.length; i++) {
        var thumbRange = null, trackRange = null;

        for (var j = 0; j < audioRanges[i].children.length; j++) {
            var child = audioRanges[i].children[j];

            if (child.className === 'thumb_range') {
                var thumbRange = child;
            } else if (child.className === 'track_range') {
                var trackRange = child;
            }


        }
        thumbRange.oninput = function (thumbRange, trackRange) {
            return function (e) {
                trackRange.value = thumbRange.value;
                if (!isTime) {
                    setVideoTime(trackRange.value * getVideoDuration() / 100);
                }
            };
        }(thumbRange, trackRange);
    }
}

document.querySelector('.video').onended = function (e) {
    videoPlays = false;
};


document.querySelector('.video').onplaying = function () {
    videoPlays = true;

    setInterval(() => {
        if (videoPlays) {
            updateVideoTime();
        }
    }, 50);
}

function updateVideoTime() {
    const video = document.querySelector('.video');
    equalizeRange(video.currentTime, video.duration, rangeVideo);
}

function resetVideoTime() {
    const video = document.querySelector('.video');

    videoPlays = false;

    video.currentTime = 0;
    rangeVideo[3].value = "0";
    rangeVideo[1].value = "0";
}

rangeVideo[3].value = "0";
rangeVideo[1].value = "0";

modifyRange(styledRanges, false);

document.addEventListener('click', function (event) {
    if ('.' + event.target.classList[0] === '.button-play' || '.' + event.target.parentNode.classList[0] === '.button-play') {
        if (videoPlays) {
            pauseVideo();
        } else if (!videoPlays) {
            startVideo();
        }
    }
    if ('.' + event.target.classList[0] === '.button-reset' || '.' + event.target.parentNode.classList[0] === '.button-reset') {
        resetVideoTime();
    }
});
