//chrome.browserAction.setBadgeText({text: " SC "});

var songsList = [];
var percentageListenedTo = 0;
var currentSong;
var justUpdatedSong;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "updateSongInfo":
            var title = request.data.title;
			var artist = request.data.artist;
			var album = request.data.album;
			var thumbnailCoverUrl = request.data.thumbnailCoverUrl;
			
			currentSong = {
				title: title,
				artist: artist,
				album: album,
				thumbnailCoverUrl: thumbnailCoverUrl
			};
			
			if(title && artist && album){
				var song = getSongFromList(title, artist, album);
				if(!song){
					currentSong.numberOfTimesPlayed = 0;
					songsList.push(currentSong);
					justUpdatedSong = undefined;
				}else if(!justUpdatedSong){
					justUpdatedSong = currentSong;
					updateSong({
						numberOfTimesPlayed: song.numberOfTimesPlayed + 1,
						liked: song.liked
					}, song);
				}
			}
			break;
		
		case "likeCurrentSong":
			updateSong({liked: true}, currentSong);
			break;
		
		case "likeSong":
			if(updateSong({liked: true}, request.data)){
				sendResponse({success: true});
			}else{
				sendResponse({success: false});
			}
			break;
		
		case "dislikeCurrentSong":
			updateSong({liked: false}, currentSong);
			break;
		
		case "unlikeSong":
			if(updateSong({liked: undefined}, request.data)){
				sendResponse({success: true});
			}else{
				sendResponse({success: false});
			}
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

function updateSong(updateObj, song){
	if(!updateObj || !song){
		return;
	}

	var likedUpdate = updateObj.liked;
	var numberOfTimesPlayedUpdate = updateObj.numberOfTimesPlayed;

	var title = song.title;
	var artist = song.artist;
	var album = song.album;

	// Those are the information we use to "uniquely" identify a song
	if(!title || !artist || !album){
		return;
	}

	for(var i in songsList){
		var tmpSong = songsList[i];
		if(tmpSong.artist === artist &&
		tmpSong.title === title &&
		tmpSong.album === album){
			tmpSong.liked = likedUpdate;
			if(numberOfTimesPlayedUpdate){
				tmpSong.numberOfTimesPlayed = numberOfTimesPlayedUpdate;
			}
			return true;
		}
	}

	return;
}