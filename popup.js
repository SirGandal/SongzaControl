
$(document).ready( function() {

	chrome.tabs.query({
		url: ["*://songza.com/*"]
	}, function(tabsArray) {
		
		// tabsArray will contain all the songza tabs
		// for each tab we want to inject a script to do 
		// the stuff that we do already in the content.js script

		tabsArray.forEach(function(tab){
			$("#like").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.thumb-up')[0].click();" });
			});	
			
			$("#dislike").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.thumb-down')[0].click();" });
			});	
			
			$("#playpause").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.miniplayer-control-play-pause')[0].click();" });
			});	
			
			$("#next").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.miniplayer-control-skip')[0].click();" });
			});
			
			$("#mute").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.miniplayer-volume-icon')[0].click();" });
			});
			
			console.log("Injecting script in tab: " + tab.id);
			chrome.tabs.executeScript(tab.id, { file: "jquery-2.1.3.min.js" }, function() {
				chrome.tabs.executeScript(tab.id, { file: "executableScript.js" });
			});
		});
	});
	
	updateSongsList();
});

function updateSongsList(){
	var playedSongs = chrome.extension.getBackgroundPage().songsList;
	
	var playedSongsListEl = $("#played-songs-list");
	
	playedSongsListEl.empty();
	
	playedSongs.forEach(function(songInfo){
		playedSongsListEl.append('<div class="played-song">' + 
										songInfo +
									'</div>');
	});
}
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "updateSongInfo":

            var title = request.data.title;
			var artist = request.data.artist;
			var album = request.data.album;
			var thumbnailCoverUrl = request.data.thumbnailCoverUrl;
			
			console.log(title + " " + artist + " " + thumbnailCoverUrl);

			$("#song-name").html(title);
			$("#artist-name").html(artist);
			$("#album-name").html(album);
			$("#album-art").attr("src", thumbnailCoverUrl);
			
			updateSongsList();

        break;

    }
    return true;
});