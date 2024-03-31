const videoContent = document.getElementById("video-content");
const playlistContainer = document.querySelector(".play-list");
let youtubePlayer;
let playlistVideos = [];
let playlistVideosDetails = [];
let currentVideoIndex = 0;

function loadYoutubePlayer() {
  const youtubeApiKey = "YOUR_API_KEY";
  const scriptURL = `https://www.youtube.com/iframe_api?enablejsapi=1&key=${youtubeApiKey}`;
  const tag = document.createElement("script");
  tag.src = scriptURL;
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player("video-content", {
    height: "390",
    width: "640",
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {}

function handleSearch() {
  const url = searchBoxInput.value;

  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(watch\?v=)?([^\s&]+)/;
  const match = url.match(youtubeRegex);

  if (match) {
    const videoId = match[2];

    if (!youtubePlayer) {
      loadYoutubePlayer();
    } else {
      const playlistId = "YOUR_PLAYLIST_ID"; // Replace with your playlist ID
      addVideoToPlaylist(videoId, playlistId);
    }
  } else {
    const errorElement = document.querySelector(".error");
    errorElement.classList.add("show");
    errorElement.style.transform = "translate(10px)";
    setTimeout(() => {
      errorElement.classList.remove("show");
      errorElement.classList.add("fade-out");
      setTimeout(() => {
        errorElement.remove();
      }, 1000);
    }, 1000);
  }
}

function addVideoToPlaylist(videoId, playlistId) {
  videoContent.innerHTML = ""; // Clear video content
  if (youtubePlayer) {
    youtubePlayer.loadVideoById(videoId);
    // Automatically play the video
    if (youtubePlayer.getPlayerState() !== YT.PlayerState.PLAYING) {
      youtubePlayer.playVideo();
    }
  }

  playlistVideos.push(videoId);
  fetchVideoDetails(videoId);
  updatePlaylistDisplay();
}

function removeVideoFromPlaylist(index) {
  playlistVideos.splice(index, 1);
  playlistVideosDetails.splice(index, 1);
  updatePlaylistDisplay();
  if (index === currentVideoIndex) {
    currentVideoIndex = (currentVideoIndex + 1) % playlistVideos.length;
    const nextVideoId = playlistVideos[currentVideoIndex];
    youtubePlayer.loadVideoById(nextVideoId);
  } else if (index < currentVideoIndex) {
    currentVideoIndex--;
  }
}

function fetchVideoDetails(videoId) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
  const title = `Video Title ${videoId}`;

  playlistVideosDetails.push({ videoId, thumbnailUrl, title });
}

function updatePlaylistDisplay() {
  playlistContainer.innerHTML = "";

  if (playlistVideos.length === 0) {
    const emptyPlaylistMessage = document.querySelector(".empty");
    emptyPlaylistMessage.style.display = "block";
    videoContent.innerHTML =
      '<div style="color: white">Select a video from the playlist to watch</div>';
    const listbox = document.querySelector(".item-video");
    listbox.style.display = "none"; // Hide the item-video container
    return;
  }

  playlistVideosDetails.forEach((video, index) => {
    const listItem = document.createElement("div");
    listItem.classList.add("playlist-item");

    const itemVideo = document.createElement("div");
    itemVideo.classList.add("item-video");

    const thumbnailImg = document.createElement("img");
    thumbnailImg.src = `https://img.youtube.com/vi/${video.videoId}/0.jpg`;
    thumbnailImg.alt = "Video Thumbnail";
    itemVideo.appendChild(thumbnailImg);

    const titleElement = document.createElement("h2");
    titleElement.classList.add("item-title");
    titleElement.textContent = video.title;
    itemVideo.appendChild(titleElement);

    const closeIcon = document.createElement("a");
    closeIcon.href = "#!";
    closeIcon.innerHTML = '<i class="gg-close"></i>';
    closeIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      removeVideoFromPlaylist(index);
    });
    itemVideo.appendChild(closeIcon);

    listItem.appendChild(itemVideo);

    listItem.addEventListener("click", () => {
      currentVideoIndex = index;
      youtubePlayer.loadVideoById(video.videoId);
    });

    playlistContainer.appendChild(listItem);
  });

  const emptyPlaylistMessage = document.querySelector(".empty");
  emptyPlaylistMessage.style.display = "none";

  const listbox = document.querySelector(".item-video");
  listbox.style.display = "block"; // Show the item-video container
}

const searchBoxInput = document.querySelector(".search-box input");
const searchButton = document.querySelector('button[type="submit"]');
const playPauseButton = document.getElementById("play-pause");
const prevButton = document.getElementById("play-prev");
const nextButton = document.getElementById("play-next");

searchBoxInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    handleSearch();
  }
});

searchButton.addEventListener("click", handleSearch);

loadYoutubePlayer();

playPauseButton.addEventListener("click", () => {
  if (youtubePlayer) {
    if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      youtubePlayer.pauseVideo();
    } else {
      youtubePlayer.playVideo();
    }
  }
});

prevButton.addEventListener("click", () => {
  if (playlistVideos.length === 0) return;

  currentVideoIndex =
    (currentVideoIndex - 1 + playlistVideos.length) % playlistVideos.length;
  const prevVideoId = playlistVideos[currentVideoIndex];
  youtubePlayer.loadVideoById(prevVideoId);
});

nextButton.addEventListener("click", () => {
  if (playlistVideos.length === 0) return;

  currentVideoIndex = (currentVideoIndex + 1) % playlistVideos.length;
  const nextVideoId = playlistVideos[currentVideoIndex];
  youtubePlayer.loadVideoById(nextVideoId);
});
function removeVideoFromPlaylist(index) {
  playlistVideos.splice(index, 1);
  playlistVideosDetails.splice(index, 1);
  updatePlaylistDisplay();

  if (playlistVideos.length === 0) {
    const emptyPlaylistMessage = document.querySelector(".empty");
    emptyPlaylistMessage.style.display = "block"; // Hiển thị thông báo playlist trống
    videoContent.innerHTML = ""; // Xóa nội dung video
    if (youtubePlayer) {
      youtubePlayer.stopVideo(); // Dừng phát video
    }
  } else {
    if (index === currentVideoIndex) {
      currentVideoIndex = (currentVideoIndex + 1) % playlistVideos.length;
      const nextVideoId = playlistVideos[currentVideoIndex];
      youtubePlayer.loadVideoById(nextVideoId);
    } else if (index < currentVideoIndex) {
      currentVideoIndex--;
    }
  }
}
