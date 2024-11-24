// content.js
// Inject the download button HTML
const downloadButtonHTML = `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <span class="material-symbols-outlined">
    download
  </span>
`;

const videoDownloadButtonHTML = `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <span class="material-symbols-outlined">
    video_file
  </span>
`;

const loadingIconHTML = `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <span class="material-symbols-outlined">
    progress_activity
  </span>
`;

// Function to add download buttons
function addDownloadButtons() {
  // Find all audio elements on the page
  const audioElements = document.querySelectorAll('.playing-panel.audio, .playing_inner');
const add = document.querySelectorAll('.ads-section, .bulletin-ads-bg-block');
add.forEach((ad) => {
  ad.style.display = 'none';
});
// Iterate through each audio element
audioElements.forEach(audioElement => {
  // Check if a download button already exists
  if (!audioElement.querySelector('.download-button')) {
    // Get the song URL from the data attribute
    const songUrl = audioElement.dataset.songUrl;
    const songImage = audioElement.dataset.image;
    console.log('iage', songImage);
      // Create a new button element
      const downloadButton = document.createElement('button');
      downloadButton.classList.add('download-button'); 
      downloadButton.innerHTML = downloadButtonHTML;

      // Check if there is a video icon (look for it in the parent element)
      const videoIcon = audioElement.closest('.bulletin-news-des-row')?.querySelector('.fa-solid.fa-video');
      if (videoIcon) {
        // Create the video download button
        const videoDownloadButton = document.createElement('button'); // Now a button
        videoDownloadButton.classList.add('video-download-button'); 
        videoDownloadButton.innerHTML = videoDownloadButtonHTML;

        // Store the original button content
        videoDownloadButton.originalContent = videoDownloadButtonHTML;

        // Insert the video download button *before* the play button
        const playButtonContainer = audioElement.querySelector('.playbtn-lg'); 
        playButtonContainer.parentNode.insertBefore(videoDownloadButton, playButtonContainer); 

        // Insert the download button after the video download button
        playButtonContainer.parentNode.insertBefore(downloadButton, videoDownloadButton.nextSibling);

        // Add event listener to the video download button
        videoDownloadButton.addEventListener('click', () => {
          // Disable the button and show the loading icon
          videoDownloadButton.disabled = true;
          videoDownloadButton.innerHTML = loadingIconHTML;

          // Extract the filename from the audio URL
          const filename = songUrl.split('/').pop();

          // Construct the video URL (remove .mp3 and add .mp4)
          const videoUrl = `https://videos.yiddish24.com/${filename.replace('.mp3', '.mp4')}`;

          // Send a message to the background script to handle the download
          chrome.runtime.sendMessage({ action: 'downloadVideo', videoUrl: videoUrl, referer: 'https://www.yiddish24.com/' });
        });

        // Listen for download completion or cancellation messages
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          if (request.action === 'downloadComplete' || request.action === 'downloadCancelled') {
            // Re-enable the button and restore the original content
            videoDownloadButton.disabled = false;
            videoDownloadButton.innerHTML = videoDownloadButton.originalContent;
          }
        });
      } else {
        // Add the button next to the play button (Updated targeting)
        const playButtonContainer = audioElement.querySelector('.playbtn-lg'); 
        const playButton = playButtonContainer.querySelector('.playBtn');
        playButtonContainer.parentNode.insertBefore(downloadButton, playButtonContainer.nextSibling); 
      }

      // Add event listener to the button
      downloadButton.addEventListener('click', () => {
        // Send a message to the background script to handle the download
        chrome.runtime.sendMessage({ action: 'downloadAudio', songUrl: songUrl, referer: 'https://www.yiddish24.com/' });
      });
    }
  });
}

// Call the function on page load
addDownloadButtons();

// Listen for DOM changes to add buttons to newly loaded elements
// Use a more specific target for the MutationObserver
document.addEventListener('DOMContentLoaded', () => {
  const audioContainer = document.querySelector('body'); 
  const observer = new MutationObserver(addDownloadButtons);
  observer.observe(audioContainer, { childList: true, subtree: true });
});

// ... rest of the code remains the same ... 
// Function to download the audio file
function downloadAudio(songUrl, referer) {
  fetch(songUrl, {
    headers: {
      'Referer': referer
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = songUrl.split('/').pop();
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Download error:', error);
    });
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadAudio') {
    downloadAudio(request.songUrl, request.referer);
  } else if (request.action === 'downloadVideo') {
    downloadVideo(request.videoUrl, request.referer);
  }
});

// Function to download the video file
function downloadVideo(videoUrl, referer) {
  fetch(videoUrl, {
    headers: {
      'Referer': referer
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = videoUrl.split('/').pop();
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);

      // Send a message to the content script to restore the button
      chrome.tabs.sendMessage(sender.tab.id, { action: 'downloadComplete' });
    })
    .catch(error => {
      console.error('Download error:', error);
      // Send a message to the content script to restore the button
      chrome.tabs.sendMessage(sender.tab.id, { action: 'downloadCancelled' });
    });
}
