//inject sms Object into on http://www.magtifun.ge
function sms () {
	this.url = "scripts/sms_send.php";
	this.dateToSend = {}; 
}

//set Recipient
sms.prototype.setRecipient = function(recipient) {
	this.recipients=recipient;
};

//add Recipient 
sms.prototype.addRecipient = function(recipient) {
	this.recipients += ','+recipient;
};

sms.prototype.postSuccess = function(data) {
	alert(data );
};
sms.prototype.send = function() {
	this.dateToSend = {
		'recipients' : this.recipients,
		'message_body' : prompt(this.recipients+'\n message_body:...')
	};
	if (!this.dateToSend.message_body && this.dateToSend.message_body !== "") {
		console.log(this.dateToSend.message_body);
		$.post(this.url, this.dateToSend, this.postSuccess);
	}
}; 

//create instance of sms Object
var a = new sms();
//set Recipient 
a.setRecipient('**********'); 
//call method send and type message in prompt window
a.send();