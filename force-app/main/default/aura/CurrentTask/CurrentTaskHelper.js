({
	loadPopovers : function(component) {
		if (!component.get("v.trialFields.Current_Step__c")){
			console.log("no step yet");
			return; //don't do anything if there's not a task yet
		}
		var action = component.get("c.getWalkthroughsByActivity");
		console.log("current activity is " + component.get("v.trialFields.Current_Step__c"));
		action.setParams({
			activityId : component.get("v.trialFields.Current_Step__c")
		});
		action.setCallback(this, function(a){
			var state = a.getState();
			if (state === "SUCCESS") {
				console.log(a.getReturnValue());
				if (a.getReturnValue().length>0){  //if there's any popovers that aren't completed
					var pom = component.find("pom");
					if (pom){
						pom.emptyPopovers();
						pom.addPopovers(a.getReturnValue());
						pom.startPopovers();
					}
				}
			} else if (state === "ERROR") {
				console.log(a.getError());
			}
		});
		$A.enqueueAction(action);
	},

	urlCheck : function(component) {
		let helper = this;
		if (component.get("v.stepFields.Close_URL__c")) {
			console.log("checking url...");
			let path = window.location.href;
			if (path.includes(component.get("v.stepFields.Close_URL__c"))) {
				console.log("matches: " + path + ' , ' + component.get("v.stepFields.Close_URL__c"));
				helper.checkHelper(component);
				return true;
			} else {
				console.log("doesn't match: " + path + ',' + component.get("v.stepFields.Close_URL__c"));
				return false;
			}
		}
	},

	checkHelper: function (component) {
		console.log("check is fired!");
		let actionName = "c." + component.get("v.stepFields.testMethod__c");
		console.log(actionName);
		let action = component.get(actionName);

		action.setCallback(this, function (a) {
			let state = a.getState();
			if (state === "SUCCESS") {

				component.find("tvua").eventMethod("success", component.get("v.stepFieldsE.testMethod__c"), component.get("v.stepFieldsE.Name"));

				console.log(a.getReturnValue());  //getReturnValue is the value of the next step in the chain
				if (a.getReturnValue()) {
					//mark current path complete
					console.log("stepFieldsE:");
					console.log(component.get("v.stepFieldsE"));

					component.set("v.stepFieldsE.Completed__c", true);
					component.find("stepRecE").saveRecord(
						$A.getCallback(function (stepResult) {
							//console.log(stepResult);
							if (stepResult.state === "SUCCESS") {
								// update the trial with the path step that came back!
								component.set("v.trialFieldsE.Current_Step__c", a.getReturnValue());
								component.find("trialRecE").saveRecord(
									$A.getCallback(function (trialResult) {
										//console.log(trialResult);
										if (trialResult.state === "SUCCESS") {
											console.log(" trial updated successfully");
											//component.find("trialE").reloadRecord();
										} else if (trialResult.state === "INCOMPLETE") {
											console.log('User is offline, device doesn\'t support drafts.');
										} else if (trialResult.state === "ERROR") {
											component.find("leh").passErrors(trialResult.error);
										}
									})
								);
							} else if (stepResult.state === "INCOMPLETE") {
								console.log('User is offline, device doesn\'t support drafts.');
							} else if (stepResult.state === "ERROR") {
								component.find("leh").passErrors(stepResult.error);
							}
						})
					);
					$A.get("e.force:showToast")
						.setParams({ "message": "You did it!  Let's move on to the next task", "type": "success" }).fire();
					//finally, pop the utility open
				}
			} else if (state === "ERROR") {
				console.log(a.getError());
				component.find("leh").passErrors(a.getError());
				component.find("tvua").eventMethod("verifyError", component.get("v.methodName"), a.getError().message);
			} else {
				console.log(a);
			}
		});
		$A.enqueueAction(action);
	}
})