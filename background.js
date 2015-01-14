//chrome.browserAction.setBadgeText({text: " SC "});

var songsList = [];
var percentageListenedTo = 0;
var currentSong;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "updateSongInfo":
            var title = request.data.title;
			var artist = request.data.artist;
			var album = request.data.album;
			var thumbnailCoverUrl = request.data.thumbnailCoverUrl;

			// var logInfo = title + " - " + artist;
			
			currentSong = {
				title: title,
				artist: artist,
				album: album,
				thumbnailCoverUrl: thumbnailCoverUrl
			};
			
			if(title && artist && album && !getSongFromList(title, artist, album)){
				songsList.push(currentSong);
			}
			
			// if(title && artist && songsList.indexOf(logInfo) === -1){
				// songsList.push(logInfo);
			// }
        break;
		
		case "likeCurrentSong": 
			likeCurrentSong(currentSong);
		break;
    }
    return true;
});

function getSongFromList(title, artist, album){

	for(var i in songsList){
		var song = songsList[i];
		if(song.artist === artist &&
		song.title === title && 
		song.album === album){
			return song;
		}
	}
	
	return;
}

function likeCurrentSong(song){
	if(!song){return;}
	
	var title = song.title;
	var artist = song.artist;
	var album = song.album;

	if(!title || !artist || !album){
		return;
	}
	
	for(var i in songsList){
		var song = songsList[i];
		if(song.artist === artist &&
		song.title === title && 
		song.album === album){
			song.liked = true;
			return;
		}
	}
	
	return;
}