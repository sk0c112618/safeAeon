public with sharing class feedback {
	public static final string endpoint = 'https://cdo-demo-main-159a7094ef6-15ab9e95e81.secure.force.com/trialfeedback/services/apexrest/feedback';

	@AuraEnabled
	public static string postFeedback(string rating, string comments){
		feedbackObject f = new feedbackObject(rating, comments);
		HttpRequest req = new HttpRequest();
	  req.setMethod('POST');
	  req.setTimeout(120000);
	  req.setEndpoint(endpoint);
	  string body = JSON.serialize(f);
	  system.debug(body);
	  req.setBody(body);
	  req.setHeader('Content-Type', 'application/json');

	  Http http = new Http();
	  HTTPResponse res = http.send(req);
	  system.debug(res.toString());
	  return res.toString();

	}

	public class feedbackObject {
		string orgId;
		string comments;
		string rating;
		string userId;
		string firstname;
		string lastname;
		string email;

		public feedbackObject(string rating, string comments){
			this.orgId = UserInfo.getOrganizationId();
			this.userId = UserInfo.getUserId();
			this.firstname = UserInfo.getFirstName();
			this.lastname = UserInfo.getLastName();
			this.email = UserInfo.getUserEmail();
			this.rating = rating;
			this.comments = comments;
		}
	}
}