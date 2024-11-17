// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadAudio') {
    // Send the download request to content.js
    chrome.tabs.sendMessage(sender.tab.id, { action: 'downloadAudio', songUrl: request.songUrl, referer: request.referer });
  } else if (request.action === 'downloadVideo') {
    // Send the download request to content.js
    chrome.tabs.sendMessage(sender.tab.id, { action: 'downloadVideo', videoUrl: request.videoUrl, referer: request.referer });
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
