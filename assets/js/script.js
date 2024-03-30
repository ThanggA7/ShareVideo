// Element containing video content
const videoContent = document.getElementById("video-content");

// Search box input
const searchBoxInput = document.querySelector(".search-box input");

// Play/pause button (optional)
const playPauseButton = document.getElementById("play-pause");

// Hide initial message
videoContent.firstElementChild.style.display = "none";

// Search button
const searchButton = document.querySelector('button[type="submit"]');

// YouTube player variable
let youtubePlayer;

// Load YouTube iframe player function
function loadYoutubePlayer() {
  // Replace 'YOUR_API_KEY' with your YouTube Data v3 API key
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

const handleSearch = () => {
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
};

searchBoxInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    handleSearch();
  }
});

searchButton.addEventListener("click", handleSearch);

// Function to add video to playlist using YouTube API (needs implementation)
function addVideoToPlaylist(videoId, playlistId) {
  // Implement logic to add video to playlist using YouTube Data API v3
  // Refer to: https://developers.google.com/youtube/v3/docs/playlistItems/insert

  // After successful addition, hide message and play video (optional)
  videoContent.firstElementChild.style.display = "none";
  if (youtubePlayer) {
    youtubePlayer.loadVideoById(videoId);
    if (playPauseButton) {
      playPauseButton.click(); // Simulate play button click
    }
  }
}

// Hide comments section (assuming comments have a class 'comments')
const commentsSection = document.querySelector(".comments");
if (commentsSection) {
  commentsSection.style.display = "none";
}

// Call loadYoutubePlayer initially (assuming you want to load API on page load)
loadYoutubePlayer();
