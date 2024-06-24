const wrapper = document.querySelector(".wrapper");

const musicImg = wrapper.querySelector(".img-area img");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");

const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");

const replayBtn = wrapper.querySelector("#replay");
const forwardBtn = wrapper.querySelector("#forward");

const musicList = wrapper.querySelector(".music-list");
const moreMusicBtn = wrapper.querySelector("#more-music");
const closemoreMusic = musicList.querySelector("#close");
const listSelect = document.querySelector('.list_select');

const currentTime = document.querySelector(".current-time");
const maxDuration = document.querySelector(".max-duration");

let progressArea = wrapper.querySelector(".progress-area");
let progressBar = progressArea.querySelector(".progress-bar");
let isDragging = false;



// Get the URL of the current page.
let url = new URL(window.location.href);

// URL to get the 'songInfo' parameter.
let songInfoParam = url.searchParams.get('songInfo');

// 'songInfo' parameter value.
let songInfo = null;
if (songInfoParam) {
    songInfo = JSON.parse(decodeURIComponent(songInfoParam));
}

prevBtn.addEventListener("click", () => {
    musicIndex = musicIndex <= 1 ? listSelect.childElementCount : musicIndex - 1;

    musicName.innerHTML = listSelect.children[musicIndex - 1].querySelector("span").innerText;
    musicArtist.innerHTML = listSelect.children[musicIndex - 1].querySelector("p").innerText;
    musicImg.src = listSelect.children[musicIndex - 1].querySelector("img").src;

    playingSong();
});

nextBtn.addEventListener("click", () => {
    musicIndex = musicIndex >= listSelect.childElementCount ? 1 : musicIndex + 1;

    musicName.innerHTML = listSelect.children[musicIndex - 1].querySelector("span").innerText;
    musicArtist.innerHTML = listSelect.children[musicIndex - 1].querySelector("p").innerText;
    musicImg.src = listSelect.children[musicIndex - 1].querySelector("img").src;

    playingSong();
});


// 'genre' and 'rank' values from the 'songInfo' object.
let genre = songInfo.genre;
let rank = songInfo.rank;
let body = JSON.stringify({ genre: genre });
let musicIndex;

fetch('/load_data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ genre }),
}).then(res => res.json()).then(data => {

    musicName.innerText = data[rank]['0'];
    musicArtist.innerText = data[rank]['1'];
    musicImg.src = data[rank]['2'];
    musicIndex = rank;

    for (let i = 1; i < Object.keys(data).length; i++) {
        listSelect.innerHTML += `<li li-index="${i}">
                                    <div class="row">
                                        <span>${data[i]['0']}</span>
                                        <p>${data[i]['1']}</p>
                                        <img src="${data[i]['2']}" style="display: none;">
                                    </div> 
                                    <span class="audio-now"></span>
                                </li>`;
    }

    playingSong();
});

// listSelect to play music
listSelect.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        musicIndex = e.target.getAttribute("li-index");

        musicName.innerText = e.target.querySelector("span").innerText;
        musicArtist.innerText = e.target.querySelector("p").innerText;
        musicImg.src = e.target.querySelector("img").src;

        playingSong();
    }
});



// Show music list onclick of more music button
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");

    const playingSong = musicList.querySelector(".playing");

    if (playingSong) {
        playingSong.scrollIntoView({ behavior: "smooth" });
    }
});

closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});


const ulTag = wrapper.querySelector("ul");


//play particular song from the list onclick of li tag
function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-now");

        // Remove 'playing' class and 'Playing' text from all songs
        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            audioTag.innerText = "";
        }

        //if the li tag index is equal to the musicIndex then add playing class in it
        if (j == musicIndex - 1) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
    // change the music details with the clicked li index details
    window.history.pushState(null, null, `?songInfo=${encodeURIComponent(JSON.stringify({ genre: genre, rank: musicIndex }))}`);

    loadMusic();

    let name = document.getElementsByClassName("name")[0].textContent;
    console.log(name);
    fetch('/review_load', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
        }),
    })
        .then(res => res.json()).then(data => {
            var commentBody = document.getElementsByClassName("comment-list-wrapper");

            console.log("리뷰 불러오기");
            console.log(data);
            console.log("--------------------");

            commentBody[0].innerHTML = "";

            for (var i = 0; i < data.review.length; i++) {
                var newComment = document.createElement("div");

                newComment.innerHTML = `
                <div class="comment">
                    <div>
                        <img class="comment-image" src="../img/user.png" alt="">
                    </div>
                    <div class="comment-info">
                        <div class="comment-nickname">${data.review[i]["0"]}</div>
                        <div class="comment-text">${data.review[i]["1"]}</div>
                    </div>
                </div>
            `;

                commentBody[0].appendChild(newComment);
            }

            // chat-count Update
            var chatCount = document.getElementsByClassName("chat-count")[0];
            chatCount.innerText = `이 음악에는 ${data.review.length}개의 댓글이 있습니다`;

            commentBody[0].scrollTop = commentBody[0].scrollHeight;
            commentInput.value = "";
        });
}




//particular li clicked function
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    playingSong();
}




function loadMusic() {
    // post get으로 /music_youtube_get_url로 요청을 보내서 음악의 id를 받아옴
    fetch('/music_youtube_get_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: musicName.innerText + " " + musicArtist.innerText + "가사" }),
    }).then(res => res.json()).then(data => {
        playMusic(data);
    });
}



playPauseBtn.addEventListener("click", () => {
    musicPauseORPlay();
});

function musicPauseORPlay() {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? player.playVideo() : player.pauseVideo();
    wrapper.classList.toggle("paused");

    let icon = playPauseBtn.querySelector("i");
    if (isMusicPaused) {
        icon.classList.remove("play_arrow");
        icon.classList.add("pause");
    } else {
        icon.classList.remove("pause");
        icon.classList.add("play_arrow");
    }
}



function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}




var player;

// This function must be in the global scope
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '640',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

var done = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        maxDuration.textContent = formatTime(player.getDuration());

        setTimeout(stopVideo, 6000);
        done = true;
    }
}

function playMusic(link) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Set the videoId when the API is ready
    if (player && player.loadVideoById) {
        player.loadVideoById(link[0]);
    }

    let intervalId = setInterval(() => {
        if (player.getPlayerState() == 1) {
            currentTime.textContent = formatTime(player.getCurrentTime());
            let progressPercentage = (player.getCurrentTime() / player.getDuration()) * 100;
            progressBar.style.width = progressPercentage + "%";

            if (player.getDuration() - player.getCurrentTime() <= 1) {
                nextBtn.click();
            }
        }
    }, 1000);

    setTimeout(() => {
        if (player && player.loadVideoById) {
            player.loadVideoById(link[0]);
        }
    }, 1000);

    setTimeout(() => {
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
            player.loadVideoById(link[1]);
            console.log("retry");
        }
    }, 3000);
}


replayBtn.addEventListener("click", () => {
    player.seekTo(player.getCurrentTime() - 10);
    update_data(-10);
});

forwardBtn.addEventListener("click", () => {
    player.seekTo(player.getCurrentTime() + 10);
    update_data(10);
})

function update_data(val) {
    currentTime.textContent = formatTime(player.getCurrentTime() + val);
    let progressPercentage = ((player.getCurrentTime() + val) / player.getDuration()) * 100;
    progressBar.style.width = progressPercentage + "%";
}

progressArea.addEventListener('mousedown', (event) => {
    isDragging = true;
    updateProgressBar(event);
});

window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        updateProgressBar(event);
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// progress bar Update
function updateProgressBar(event) {
    let progressAreaRect = progressArea.getBoundingClientRect();
    let newProgressPosition = event.clientX - progressAreaRect.left;
    let progressPercentage = (newProgressPosition / progressAreaRect.width) * 100;

    progressPercentage = Math.min(Math.max(progressPercentage, 0), 100);

    progressBar.style.width = progressPercentage + "%";
    player.seekTo((progressPercentage / 100) * player.getDuration());
}