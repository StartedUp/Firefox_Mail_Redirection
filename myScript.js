var url =document.location.href
if (url.search("%40")>0 && (url.search('search')>0 ||url.search('#q=')>0) && url.search('google')) {
	var firstAt = url.indexOf("%40");
	var secondAt = url.indexOf("%40",firstAt+1);
	console.log('secondAt '+secondAt+' firstAt '+firstAt);
	var idStart = url.indexOf("q=");
	var idEnd = url.indexOf("&");
		if (idEnd!=-1) {
			var mailId = url.substring(idStart+2,idEnd);
		}else{
			var mailId = url.substring(idStart+2);
		}	
	chrome.storage.sync.set({"mailId": mailId}, function () {
		console.log("saved!");
		chrome.storage.sync.get("mailId", function (value) { console.log("read value: ", value.mailId);});
	});
	if ((secondAt-firstAt)>25||secondAt<0) {
		var at_pos = mailId.indexOf("%40");
		var domain = mailId.substring(at_pos+3);
		console.log('domain single @'+domain)
	}else{
		var mailIdFirstAt=mailId.indexOf('%40');
		var mailIdSecondAt=mailId.indexOf('%40',mailIdFirstAt+1);
		var domain = mailId.substring(mailIdSecondAt+3);
		console.log('single @ domain '+ domain)
	}
	if (domain.startsWith("gmail")) {
		window.open('https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/?'+mailId+'&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#identifier',"_self");
	}
	else if(domain.startsWith("yahoo")||domain.startsWith("ymail")){
		window.open('https://login.yahoo.com/?.src=ym&.intl=us&.lang=en-US&.done=https%3a//mail.yahoo.com?'+mailId,"_self");
	}
	else{window.open('http://www.'+domain,"_self")};
}

else {
	chrome.storage.sync.get("mailId", function (value) {
		console.log(value.mailId);
		var firstAt=value.mailId.indexOf('%40');
		var secondAt=value.mailId.indexOf('%40',firstAt+1);
		if (secondAt>0) {
			var mail=value.mailId.substring(0,secondAt); console.log("read value full: ", mail);
			mail =mail.replace('%40','@');
		}else{
			var mail =value.mailId.substring(0,firstAt);console.log("read value: ", mail);
		}
		if (document.domain=="facebook.com") {
			document.getElementById("email").value=mail;
		}else{
			$('input[type="email"]').val(mail);
			if(document.getElementById('login-email'))
				document.getElementById('login-email').value=mail;
		}
		window.setTimeout(clearStrorage, 500);
	});		
}

if(url.search("mail.yahoo.com")>0){
	var mailUrl = document.location.href;
	var mail = (mailUrl.substring(mailUrl.indexOf('.com?')+5,mailUrl.search('%40')));//.replace("%40",'@');
	document.getElementById("login-username").value=mail;
	if(document.getElementById("login-passwd").getAttribute('aria-hidden')){
			//document.getElementById("login-signin").click();
	}
}
else if (url.search('continue=https://mail.google.com/mail/?')>0 && url.search('accounts.google.com')>0) {
		var mailUrl = document.location.href;
		var start=(mailUrl.indexOf('/mail/?'))+7;
		var end=mailUrl.indexOf("%40");
		var email = mailUrl.substring(start,end);
	//email =email.replace("%2540",'@');
	document.getElementById("Email").value=email;
	//document.getElementById("next").click();

}
function clearStrorage () {
		chrome.storage.sync.set({"mailId": ""}, function () {
			console.log("saved!");
			chrome.storage.sync.get("mailId", function (value) { console.log("read value: ", value.mailId);});
	});
}