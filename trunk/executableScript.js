// This script is called/injected everytime the user clicks on the plugin icon

var tmpTitle = $(".miniplayer-info-track-title a").attr("title");
var tmpArtist = $(".miniplayer-info-artist-name a").attr("title");
var tmpThumbnailCoverUrl = $(".miniplayer-album-art").attr("src");
var tmpAlbum = $(".miniplayer-info-album-title").text();

// We register handlers to the changes of the player so that if the popup is open
// and in the meantime the song changes we can update the information displayed

var player = $("#player");

if(player){
	$("#player").unbind();
	$("#player").bind('DOMNodeInserted DOMNodeRemoved', onNodeInsertedOrRemoved);
	console.log("#player bound to DOMNodeInserted DOMNodeRemoved");
}else{
	console.log("ERROR in bounding #player to DOMNodeInserted DOMNodeRemoved");
}

updateCurrentlyPlayingSongInfo(tmpTitle, tmpArtist, tmpThumbnailCoverUrl, tmpAlbum);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "likeCurrentSong":
            console.log("received message: likeCurrentSong");
            $(".thumb-up")[0].click();
            break;
    }
    return true;
});

function updateCurrentlyPlayingSongInfo(title, artist, thumbnailCoverUrl, album){

	var payload = {
			title: title,
			artist: artist,
			thumbnailCoverUrl: thumbnailCoverUrl,
			album: album
		};

	// The popup.js will listen for this message so that it can update the HTML
	chrome.extension.sendMessage({
		type: "updateSongInfo",
		data: payload
	});
}

function onNodeInsertedOrRemoved(event){

		var currentTimePercentage = Math.ceil(( 100 * parseFloat($('.miniplayer-timeline-current-time').css('width')) / parseFloat($('.miniplayer-timeline-current-time').parent().css('width')) ));
		
		if(currentTimePercentage !== "0"){
			percentageListenedTo = currentTimePercentage;
		}
		
        var _title = $(".miniplayer-info-track-title a").attr("title");
        var _artist = $(".miniplayer-info-artist-name a").attr("title");
        var _thumbnailCoverUrl = $(".miniplayer-album-art").attr("src");
		var _album = $(".miniplayer-info-album-title").text();
		
		updateCurrentlyPlayingSongInfo(_title, _artist, _thumbnailCoverUrl, _album);
}