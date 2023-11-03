public with sharing class UniversalAnalytics {

	public static final string trackingID = 'UA-104507246-2';
	public static final string endpoint = 'https://www.google-analytics.com/collect';
	public static final string endpointBatch = 'https://www.google-analytics.com/batch';

	public static final string baseString = 'v=1&tid='+trackingID;

	@AuraEnabled
	public static void pageHit(string pageName, string pageTitle) {
		string body = baseString + '&cid=' + getClientId() + '&t=pageview' + '&dp=' + pageName + '&dt=' + pageTitle;
		system.debug(body);
		standard(body);
	}

	@AuraEnabled
	public static void eventHit(string category, string action, string label) {
		string body = baseString + '&cid=' + getClientId() + '&t=event' + '&ec=' + category + '&ea=' + action;
		if (label!=null){
			body = body + '&el=' + label;
		}

		system.debug(body);
		standard(body);
	}

	public static string getClientId(){
		return 'o'+UserInfo.getOrganizationId()+'u'+UserInfo.getUserId();
	}

	public static HTTPResponse standard(string body){

	  HttpRequest req = new HttpRequest();
	  req.setMethod('POST');
	  req.setTimeout(120000);
	  req.setEndpoint(endpoint);
	  req.setBody(body);

	  Http http = new Http();
	  HTTPResponse res = http.send(req);
	  system.debug(res.toString());
	  return res;
	}

}