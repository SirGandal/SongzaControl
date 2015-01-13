var percentageListenedTo = 0;
var songsList = [];

$(document).ready( function() {
    alert("dom loaded");
	
	// removed for testing
	//$("#player").bind('DOMNodeInserted DOMNodeRemoved', onNodeInsertedOrRemoved);
});

function onNodeInsertedOrRemoved(event){

		var currentTimePercentage = Math.ceil(( 100 * parseFloat($('.miniplayer-timeline-current-time').css('width')) / parseFloat($('.miniplayer-timeline-current-time').parent().css('width')) ));
		
		if(currentTimePercentage !== "0"){
			percentageListenedTo = currentTimePercentage;
		}
		
        var title = $(".miniplayer-info-track-title a").attr("title");
        var artist = $(".miniplayer-info-artist-name a").attr("title");
        
		var logInfo = title + " - " + artist;
		
		if(title && artist && songsList.indexOf(logInfo) === -1){
			// console.log("% listened : " + percentageListenedTo);
			songsList.push(logInfo);
			alert(title + " - " + artist);
			percentageListenedTo = 0;
		}
}
