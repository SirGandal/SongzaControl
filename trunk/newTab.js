$(document).ready( function() {
	var songsList;

	chrome.storage.sync.get("songzaControlSongsList", function(items){
		if(items && items.songzaControlSongsList){
			songsList = items.songzaControlSongsList;
			var songsListEl = $("#songs-list tbody");

			if(songsList && songsListEl){
				var index = 0;
				songsList.forEach(function(song){
					if(song.liked){
						songsListEl.append('<tr' + ((index % 2 === 0) ? "" : ' class="even"') + '>' +
												'<td><img src="' + song.thumbnailCoverUrl + '"></td>' +
												'<td>' + song.title + '</td>' +
												'<td>' + song.artist + '</td>' +
												'<td>' + ((song.album.indexOf("from ") === 0) ? song.album.substr("from ".length, song.album.length) : song.album) + '</td>' +
												'<td>' + song.numberOfTimesPlayed + '</td>' +
												'<td><a target="_blank" href="' + encodeURI('http://grooveshark.com/#!/search?q=' + song.title + " " + song.artist) +'">grooveshark</a></td>' +
											'</tr>');
						index = index + 1;
						}
					});
			}
		}
	});	
});