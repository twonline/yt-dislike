/*
Base Version from - https://github.com/aquelemiguel/yt-restore-dislikes
Ported and Updated to Firefox by - TW-ONLINE
*/
(function () {
  const BASE_ENDPOINT = "https://www.googleapis.com/youtube/v3";

  async function run() {
    fetchDislikes()
      .then((dislikeNo) => editDislikes(dislikeNo))
      .catch((err) => console.error(err));
  }

  async function fetchDislikes() {
    // Fetch API key
    const gettingApiKey = browser.storage.sync.get('apikey');
    const videoId = new URLSearchParams(window.location.search).get("v");
    var endpoint;

    await gettingApiKey.then((res) => {
      endpoint = `${BASE_ENDPOINT}/videos?key=${res.apikey}&id=${videoId}&part=statistics`;
    });

    // Call Google API endpoint
    return fetch(endpoint)
      .then((r) => r.json())
      .then((r) => r.items[0].statistics);
  }

  function editDislikes(dislikeNo) {
    const dislike = parseInt(dislikeNo.dislikeCount);
    const likeSht = parseInt(dislikeNo.likeCount);
    // Fetch the dislike label
    const selector =
      "ytd-menu-renderer.ytd-video-primary-info-renderer > div > :nth-child(2) yt-formatted-string";
    const dislikeLabel = document.querySelector(selector);
    // Update the label with the new dislike count
    const formattedDislikes = convertToYTThousands(dislike);
    dislikeLabel.textContent = formattedDislikes;
    // Fetch the likebar
    const selectorBar =
      "ytd-sentiment-bar-renderer.ytd-video-primary-info-renderer";
    const dislikeBar = document.querySelector(selectorBar);
    // Unhide likebar
    dislikeBar.hidden = false;
    // Update and Render likebar ratio
    const dislikeBarInner = document.getElementById("like-bar");
    const disper = getDislikeRatio(likeSht, dislike);
    dislikeBarInner.style = `width: ${disper}%;`;
  }

  function convertToYTThousands(num) {
    if (num < 1000) {
      return num;
    }
    if (num < 1000000) {
      return `${Math.round((num / 1000) * 10) / 10}K`;
    }

    return `${Math.round((num / 1000000) * 10) / 10}M`;
  }

  function getDislikeRatio(like, dis) {
    const ratio = like / (like + dis);
    return ratio * 100;
  }

  run();
})();
