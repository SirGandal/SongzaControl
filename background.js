//chrome.browserAction.setBadgeText({text: " SC "});

var songsList = [];
chrome.storage.sync.get("songzaControlSongsList", function(items){
	if(items && items.songzaControlSongsList && items.songzaControlSongsList.length > 0){
		songsList = items.songzaControlSongsList;
	}
});

var percentageListenedTo = 0;
var currentSong;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "updateSongInfo":
            
			currentSong = request.data;
			var existingSong = getSongFromList(currentSong);

			if(existingSong){
				updateSong({
						numberOfTimesPlayed: existingSong.numberOfTimesPlayed + 1,
						liked: existingSong.liked
					}, existingSong);
			}else{
				currentSong.numberOfTimesPlayed = 1;
				songsList.push(currentSong);
			}
			// update storage
			chrome.storage.sync.set({'songzaControlSongsList': songsList}, function() {});
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

function getSongFromList(song){

	for(var i in songsList){
		var s = songsList[i];
		if(s.title === song.title && 
			s.artist === song.artist && 
			s.album === song.album){
			return s;
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
		if(tmpSong.title === title && 
			tmpSong.artist === artist &&
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
