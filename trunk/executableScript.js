var player = $("#player");

if(player){
	$("#player").bind('DOMNodeInserted DOMNodeRemoved', onNodeInsertedOrRemoved);
}

var currentSong = getPlayerInfo();
if(currentSong){
	chrome.extension.sendMessage({
		type: "popupOpen",
		data:currentSong
	});
}