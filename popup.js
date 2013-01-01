function sms () {
	this.recipients = '';
	this.buttonAddRecipient = $("#addRecipient") ;
	this.buttonSetRecipient = $("#setRecipient") ;
	this.buttonSend =  $("#send") ;
	this.messageBody =  $("#messageBody");
	this.divRecipients = $("#recipients");
	this.divResponse = $("#response");
	this.divOk = $("#ok");
	this.divNo = $("#no");
	this.aMagtifun = $("#magtifun");
	this.init();
}
//init
sms.prototype.init = function() {
	var self = this;
	chrome.extension.sendMessage("1.2.1.2.1.2",function(response){
		setTimeout(function(){
			self.getRecipient();
		},500);
	});
	this.initIvents();

};
//set Recipient
sms.prototype.getRecipient = function() {
	var self = this;
	chrome.extension.sendMessage({_method : "getRecipient"},function(response){
		if(response){
			if(response != 'no'){
				self.setRecipient(response);
			}else{
				self.divOk.hide();
				self.divNo.show();
			}
		}
	});
};

sms.prototype.initIvents = function() {
	var self =this;
	this.buttonAddRecipient.click(function() {
		var recipient = prompt("corent recipients:"+self.recipients+";\nadd recipient:");

		if (recipient && $.trim(recipient) !== ""){
			self.addRecipient(recipient);
		}

	});

	this.aMagtifun.click(function(){
		chrome.tabs.create({url: "http://www.magtifun.ge"});
	});

	this.buttonSetRecipient.click(function() {
		var recipient = prompt("set recipient:");

		if (recipient && $.trim(recipient) !== ""){
			self.setRecipient(recipient);
		}

	});

	this.buttonSend.click(function() {
		self.send();
	});
};

//set Recipient
sms.prototype.setRecipient = function(recipient) {
	this.recipients=recipient;
	this.divRecipients.text(this.recipients);
	chrome.extension.sendMessage({
		_method : "setRecipient",
		_argument:recipient
	});
};
sms.prototype.showResponse = function(response) {
	this.messageBody.val("");
	this.divResponse.fadeIn("fast").text(response);
	var self = this;
	setTimeout(function(){
		self.divResponse.fadeOut("fast");
	},1000);
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

sms.prototype.send = function() {
	var message = {
		_method : "send",
		_argument : {
			recipients : this.recipients,
			message_body : this.messageBody.val()
		}
	};
	chrome.extension.sendMessage(message);
 

};

var smsobj;

document.onreadystatechange = function () {
	if (document.readyState == "complete") {

		smsobj = new sms();

	}
};