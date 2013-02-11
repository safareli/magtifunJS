var a = $("<button>")
.addClass("btn green_btn round_border medium")
.text("სწრაფი გაგზავნა").click(__sms_check__)
.after("<span id=\"OOOOOK\">წარმატებით გაიგზავნა</span>");
$("#loading").after(a);
$("#OOOOOK").hide().css({
	"margin-left": "15px",
	"background": "rgba(222, 253, 202, 0.43)",
	"padding": ".5em"
}).addClass("green medium round_border");


window.onkeydown =function(e){
	if(e.keyCode == 13 && e.shiftKey && document.activeElement == getID('message_body')){
		e.preventDefault();
		__sms_check__();
	}
};

// Check SMS Status
function __sms_check__ () {
	// Read Form Variables
	var send_status = true; // Send Form Continue Status
	var message_unicode = getID('message_unicode').value; // Message Unicode
	var messages_count = getID('messages_count').value; // Messages Total Count
	var recipient = getID('recipient').value; // Recipient
	var message_body = getID('message_body').value; // Message Body
	var total_recipients = getID("total_recipients").value; // Total Recipients
	var recipients = recipient; // Recipients List
	
	// Check Form Variables
	// Recipients
	$.each($('#recipient_list div'), function(key, value) {
		recipients += "," + value.id;
	});
	
	// Check Recipients
	if (trim(recipient) === "" && total_recipients === 0) {
		getID("recipient_div").innerHTML = lang_please_fill;
		$('#recipient').addClass('wrong_input');
		send_status = false;
	} else if (trim(recipient) === "" && total_recipients > conf_rcp_count) {
		getID("recipient_div").innerHTML = lang_max_recipients;
		send_status = false;
	} else if (trim(recipient) !== "" && total_recipients > conf_rcp_count - 1) {
		getID("recipient_div").innerHTML = lang_max_recipients;
		send_status = false;
	} else {
		getID("recipient_div").innerHTML = '';
	}
	
	// Message Body
	if (trim(message_body) === "") {
		getID("message_body_div").innerHTML = lang_please_fill;
		$('#message_body').addClass('wrong_input');
		send_status = false;
	} else {
		getID("message_body_div").innerHTML = '';
	}
	
	// Total Messages Count
	if (messages_count > conf_sms_count) {
		getID("max_chars_text").innerHTML = lang_max_messages;
		send_status = false;
	} else {
		getID("max_chars_text").innerHTML = "";
	}
	
	// If All Form Variables Correct
	if (send_status === true) {
		getID("loading").innerHTML = '<img src="images/loader.gif" />';
		
		// Request SMS Send Page
		$.post ('scripts/sms_send.php', { 'recipients': recipients, 'message_body': message_body },
		function (data) {
			getID("loading").innerHTML = '';
			
			// Check Response Text
			if (data == 'success') {
				// If SMS Send Returns Success
				var a = getID("recipient").value;
				getID("recipient").value = a;
				getID("message_body").value = '';
				$("#OOOOOK").fadeIn("normal");
				var smsleft = $('form[name=user_action] .xxlarge.dark.english');
				smsleft.text(smsleft.text()-1);
				setTimeout(function(){
					$("#OOOOOK").fadeOut("normal");
				},2000);
				// Clear Form
				checkLength(conf_sign_chars);
				getID('message_body').focus();
			} else if (data == 'not_enough_credit') {
				// If SMS Send Returns Not Enough Credit
				getID("loading").innerHTML = lang_not_enough_credit;
			} else if (data == 'not_enough_money') {
				// If SMS Send Returns Not Enough Money
				getID("loading").innerHTML = lang_not_enough_web_money;
			} else if (data == 'max_recipients') {
				// Maximum Recipients
				getID("recipient_div").innerHTML = lang_max_recipients;
				getID("loading").innerHTML = '';
			} else if (data == 'max_messages') {
				// Maximum Messages
				getID("max_chars_text").innerHTML = lang_max_messages;
				getID("loading").innerHTML = '';
			} else if (data == 'incorrect_mobile') {
				// If SMS Send Returns Incorrect Mobile
				getID("recipient_div").innerHTML = lang_please_correct;
				$('#recipient').addClass('wrong_input');
				getID("loading").innerHTML = '';
			} else if (data == 'fill_message') {
				// Fill Message Body
				getID("message_body_div").innerHTML = lang_please_fill;
				getID("loading").innerHTML = '';
			} else if (data == 'not_logged_in') {
				getID("log_out_form").submit();
			} else {
				// If SMS Send Returns Error
				getID("loading").innerHTML = lang_not_completed;
			}
		});
	}
}