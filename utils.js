function updateCurrentlyPlayingSongInfo(song){

	var playerPlayState = $(".player-state-play");

	song.isPlaying = playerPlayState.length > 0;

	// The popup.js will listen for this message so that it can update the HTML
	// as well as the background.js page to log those information so that it can be reused
	chrome.extension.sendMessage({
		type: "updateSongInfo",
		data: song
	});
}

function onNodeInsertedOrRemoved(event){
	//With this if we should remove the amount of times we check for actual changes in the song
	//if(event.type === "DOMNodeInserted" && $(event.target.childNodes).filter(function(index, node){return (node.className === "miniplayer-info" || node.className === "fullplayer-info");}).length > 0){

		// var currentTimePercentage = Math.ceil(( 100 * parseFloat($('.miniplayer-timeline-current-time').css('width')) / parseFloat($('.miniplayer-timeline-current-time').parent().css('width')) ));
		
		// if(currentTimePercentage !== "0"){
		// 	percentageListenedTo = currentTimePercentage;
		// }

		var song = getPlayerInfo();
			
		if(song && currentSong && 
			song.title !== currentSong.title && 
			song.artist !== currentSong.artist &&
			song.album !== currentSong.album){

			console.log("%s  - %s - %s - %s", song.title, song.artist, song.album, song.thumbnailCoverUrl);
			
			currentSong = song;
			song = undefined;
			updateCurrentlyPlayingSongInfo(currentSong);
		}
	//}
}

function getPlayerInfo(){
	var _title = $(".miniplayer-info-track-title a").attr("title");
    var _artist = $(".miniplayer-info-artist-name a").attr("title");
   	var _thumbnailCoverUrl = $(".miniplayer-album-art").attr("src");
	var _album = $(".miniplayer-info-album-title").text();
	var _isPlaying = $(".player-state-play").length > 0;

	if(_title && _artist && _album && _thumbnailCoverUrl){
		return  {
			title: _title,
			artist: _artist,
			album: _album,
			thumbnailCoverUrl: _thumbnailCoverUrl,
			isPlaying: _isPlaying
		};
	}

	return;
}