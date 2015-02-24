$(document).ready( function() {
	var songsList;

	chrome.storage.sync.get("songzaControlSongsList", function(items){
		if((items && items.songzaControlSongsList) || (chrome.extension.getBackgroundPage().songsList && chrome.extension.getBackgroundPage().songsList.length > 0)){
			songsList = items.songzaControlSongsList;

			if(songsList.length === 0){
				songsList = chrome.extension.getBackgroundPage().songsList;
			}

			var songsListEl = $("#songs-list tbody");

			if(songsList && songsListEl){
				var dataSet = [];
				songsList.forEach(function(song){
					if(song.liked){
						var songDetail = ['<img src="' + song.thumbnailCoverUrl + '">',
										song.title,
										song.artist,
										((song.album.indexOf("from ") === 0) ? song.album.substr("from ".length, song.album.length) : song.album),
										song.numberOfTimesPlayed,
										'<a target="_blank" href="' + encodeURI('http://grooveshark.com/#!/search?q=' + song.title + " " + song.artist) +'">grooveshark</a>'
										];
						dataSet.push(songDetail);
						}
					});

				
					$('#songs-list').dataTable( {
						"data": dataSet,
						"order": [[ 1, "asc" ]],
						"columns": [
							{ "title": "Cover"},
							{ "title": "Title" },
							{ "title": "Artist" },
							{ "title": "Album" },
							{ "title": "# played"},
							{ "title": "Search"}
						],
						"pagingType": "full_numbers",
						"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
						/*"dom": 'T<"clear">lfrtip',
					        "tableTools": {
					        	"sSwfPath": "DataTables-1.10.5/extras/TableTools"
					        }*/
						});
			}
		}
	});
});