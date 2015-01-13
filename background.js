//chrome.browserAction.setBadgeText({text: " SC "});

var songsList = [];
var percentageListenedTo = 0;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "updateSongInfo":
            var title = request.data.title;
			var artist = request.data.artist;
			var album = request.data.album;
			var thumbnailCoverUrl = request.data.thumbnailCoverUrl;

			var logInfo = title + " - " + artist;
			
			if(title && artist && songsList.indexOf(logInfo) === -1){
				songsList.push(logInfo);
			}
        break;
    }
    return true;
});