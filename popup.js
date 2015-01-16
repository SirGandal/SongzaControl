$(document).ready( function() {
	chrome.tabs.query({
		url: ["*://songza.com/*"]
	}, function(tabsArray) {
		
		// tabsArray will contain all the songza tabs
		// for each tab we want to inject a script to do 
		// the stuff that we do already in the content.js script

		tabsArray.forEach(function(tab){
		console.log("Injecting script in tab: " + tab.id);
			chrome.tabs.executeScript(tab.id, { file: "jquery-2.1.3.min.js" }, function() {
				chrome.tabs.executeScript(tab.id, { file: "executableScript.js" });
			});
			$("#like").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.thumb-up')[0].click();" });
				chrome.extension.sendMessage({
					type: "likeCurrentSong"
				});
				$("#like").removeClass("like").addClass("liked");
			});
			
			$("#dislike").click(function(){
				chrome.extension.sendMessage({
					type: "dislikeCurrentSong"
				});
				chrome.tabs.executeScript(tab.id, { code: "$('.thumb-down')[0].click();" });
			});
			
			$("#playpause").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.miniplayer-control-play-pause')[0].click();" });
				if($("#playpause").attr("class").indexOf("play") !== -1){
					$("#playpause").removeClass("play").addClass("pause");
				}else{
					$("#playpause").removeClass("pause").addClass("play");
				}
			});
			
			$("#next").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.miniplayer-control-skip')[0].click();" });
			});
			
			$("#audio").click(function(){
				chrome.tabs.executeScript(tab.id, { code: "$('.miniplayer-volume-icon')[0].click();" });
				if($("#audio").attr("class").indexOf("playing") !== -1){
					$("#audio").removeClass("playing").addClass("mute");
				}else{
					$("#audio").removeClass("mute").addClass("playing");
				}
			});
		});
	});
	
	updateSongsList();
});

function updateSongsList(){
	var playedSongs = chrome.extension.getBackgroundPage().songsList;
	
	if(playedSongs){
		var playedSongsListEl = $("#played-songs-list");
		
		//TODO: Improve, there is no need of emptying the list and then filling it again
		
		playedSongsListEl.empty();
		
		playedSongs.forEach(function(song){
			playedSongsListEl.append(
				'<div class="played-song">' +
					'<div class="played-song-info">' +
						'<span class="played-song-title">' + song.title + '</span>' +
						'<span class="played-song-artist">' + " - " + song.artist + '</span>' +
					'</div>' +
					(song.liked ? '<button class="song-list-liked"></button>' : (song.liked === undefined ? '<button class="song-list-like"></button>' : '<button class="song-list-disliked"></button>')) +
					'<div class="panel" style="display:none;">'+
						'<div>Number of times played: ' + song.numberOfTimesPlayed + '</div>'+
						'<a target="_blank" href="' + encodeURI('http://grooveshark.com/#!/search?q=' + song.title + " " + song.artist) +'">Search on grooveshark</a>' +
					'</div>' +
				'</div>');
			
			$(".played-song-info:last").click(function(event) {
				if($(event.target).parent().hasClass("panel-expanded")){
					$(event.target).parent().removeClass("panel-expanded");
				}else{
					$(event.target).parent().addClass("panel-expanded");
				}
				$(event.target).parent().siblings(".panel").slideToggle({duration: 200});
			});
				
			$(".played-song:last button").click(function(event){
				if($(event.target).hasClass("song-list-liked")){
					// send message to set the liked property to undefined
					chrome.extension.sendMessage(
					{
						type: "unlikeSong",
						data: {
								title: song.title,
								artist: song.artist,
								album: song.album
							}
					}, function(response){
						if(response.success){
							$(event.target).removeClass("song-list-liked").addClass("song-list-like").attr("title", "like");
						}
					});
				} else if ($(event.target).hasClass("song-list-like") ||
							$(event.target).hasClass("song-list-disliked")){
					chrome.extension.sendMessage(
					{
						type: "likeSong",
						data: {
								title: song.title,
								artist: song.artist,
								album: song.album
							}
					}, function(response){
						if(response.success){
							$(event.target).removeClass("song-list-like").addClass("song-list-liked").attr("title", "liked");
							$(event.target).removeClass("song-list-disliked").addClass("song-list-liked").attr("title", "liked");
						}
					});
				}
			});
		});
		
		// TODO: change to scroll automatically to playing song and highlight it
		playedSongsListEl.animate({ scrollTop: playedSongsListEl[0].scrollHeight}, 1000);
	}
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "updateSongInfo":
            var title = request.data.title;
			var artist = request.data.artist;
			var album = request.data.album;
			var thumbnailCoverUrl = request.data.thumbnailCoverUrl;
			var isPlaying = request.data.isPlaying;

			$("#song-name").html(title);
			$("#artist-name").html(artist);
			$("#album-name").html(album);
			$("#album-art").attr("src", thumbnailCoverUrl);

			if(isPlaying){
				$("#playpause").removeClass("play").addClass("pause");
			}else{
				$("#playpause").removeClass("pause").addClass("play");
			}
			
			updateSongsList();

        break;
    }

    return true;
});