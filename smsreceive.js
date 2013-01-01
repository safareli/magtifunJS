chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.recipients && request.message_body){

		$.post("scripts/sms_send.php", request, function(response){
			chrome.extension.sendMessage({
				_method : "showResponse",
				_argument:response
			});
		});
		sendResponse("ok");
	}else{
		sendResponse("no");
	}
});

