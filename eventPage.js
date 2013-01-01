var smsobj;

chrome.tabs.onRemoved.addListener(function(tabId,removeInfo) { 
	if (smsobj && tabId == smsobj.tabId) { 
		smsobj = null;
	}
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	console.log(request);
	
	var response = "no";

	if (request == "1.2.1.2.1.2") {
		chrome.windows.getAll({populate : true}, function (windows){
			windows.forEach(function(window){
				window.tabs.forEach(function(tab){
					if(tab.url.match('magtifun.ge/') && !smsobj){
						smsobj = new sms(tab.id);
					}
				});
			});
		});
	}

 
	if(smsobj){
		switch(request._method){
			case("setRecipient"):
				if (request._argument ) {
					smsobj.setRecipient(request._argument);
					response = "ok";
				}
			break;

			case("showResponse"):
				if (request._argument ) {
					smsobj.showResponse(request._argument);
					response = "ok";
				}
			break;

			case("getRecipient"):
				response = smsobj.getRecipient() ;
			break;

			case("addRecipient"):
				if (request._argument ) {
					smsobj.addRecipient(request._argument);
					response = "ok";
				}
			break;

			case("send"):
				if (request._argument ) {
					smsobj.send(request._argument);
					response = "ok";
				}
			break;
		}
	}

	sendResponse(response);

});




function sms (tabId) {
	this.isInjected = false ;
	this.tabId = tabId ;
	this.injectScripts();
}
//set Recipient
sms.prototype.setRecipient = function(recipient) {
	console.log("setRecipient"+recipient);
	this.recipients=recipient;
};
//set Recipient
sms.prototype.showResponse = function(response) {

	var popupUrl = chrome.extension.getURL('popup.html');

	// Look through all the pages in this extension to find one we can use.
	var views = chrome.extension.getViews();
	for (var i = 0; i < views.length; i++) {
		var view = views[i];

		// If this view has the right URL and hasn't been used yet...
		if (view.location.href == popupUrl) {

			// ...call one of its functions and set a property.
			view.smsobj.showResponse(response);
			break; // we're done
		}
	}



};

//add Recipient
sms.prototype.getRecipient = function() {
	console.log("getRecipient"+this.recipients);
	return this.recipients;
};
//add Recipient
sms.prototype.addRecipient = function(recipient) {
	if (this.recipients) {
		var recipients = this.recipients + ','+recipient;
		this.setRecipient(recipients);
	} else{
		this.setRecipient(recipient);
	}
};
//inject scripts
sms.prototype.injectScripts = function() {
	var self = this;
	console.log("injectScripts");
	chrome.tabs.executeScript(self.tabId, { file: 'jquery.min.js' }, function() {
		chrome.tabs.executeScript(self.tabId, { file: 'smsreceive.js' }, function() {
			self.isInjected = true;
		});
	});
};

sms.prototype.send = function(dateToSend) {
	if (dateToSend.message_body && dateToSend.recipients ) {
		if (!this.isInjected) {
			console.log("inNOTjectScripts");
			this.injectScripts();
		}
		chrome.tabs.sendMessage(this.tabId, dateToSend); 
	}
};


