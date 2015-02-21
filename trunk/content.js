// var percentageListenedTo = 0;
// var songsList = [];

//This script is called whenever a new page/tab is opened and matches the criteria in the manifest.json

//When the popup.js is active this script looks like is not active
var currentSong;

$(document).ready( function() {
    console.log("content.js - DOM was loaded, binding player to NodeRemoved and NodeInserted events");

	var player = $("#player");

	if(player){
		$("#player").unbind();

		$("#player").bind('DOMNodeInserted DOMNodeRemoved', function(event){

			currentSong = getPlayerInfo();
			
			if(currentSong){
				console.log("%s  - %s - %s - %s", currentSong.title, currentSong.artist, currentSong.album, currentSong.thumbnailCoverUrl);

				updateCurrentlyPlayingSongInfo(currentSong);

				$("#player").unbind();
				$("#player").bind('DOMNodeInserted DOMNodeRemoved', onNodeInsertedOrRemoved);
			}

		});
	}else{
		console.log("content.js - ERROR in bounding #player to DOMNodeInserted DOMNodeRemoved");
	}
});