({
	stepChange: function (component, event) {
		console.log("trial Rec changed..." + event.getParams().changeType);
		console.log(component.get("v.trialFields"));

		// load the dependent step record
		component.find("stepRec").reloadRecord();
		// reload the editable version of the trial
		component.find("trialRecE").reloadRecord();
		// load the editable step record
		component.find("stepRecE").reloadRecord();
		console.log(component.get("v.stepFields"));

	},

	stepLoaded : function(component, event, helper) {
		if (event.getParams().changeType === 'LOADED'){
			console.log('step loaded');

			component.find("utilitybar").openUtility();
			let match = helper.urlCheck(component); // see if there's a close_url goal for this new step and whether we're already on it.  :)


			if (!match && component.get("v.trialFields.Paths_Chosen__c") && component.get("v.trialFields.Current_Step__c")) {
				helper.loadPopovers(component);
			}
		}
	},


	vid: function (component, event) {
		$A.createComponent(
			"c:gifModal",
			{ "gifurl": component.get("v.stepFields." + event.getSource().get("v.value"))},
			function (content, status) {
				if (status === "SUCCESS") {
					component.find("gifModal").showCustomModal({
						body: content,
						cssClass: "slds-modal_large",
						showCloseButton: true
					});
				}
			}
		);
		// console.log(event.getSource().get("v.value"));
		// var nav = $A.get("e.force:navigateToComponent");
		// nav.setParams({
		// 	componentDef: "c:youtubeVideoComponent",
		// 	componentAttributes: {
		// 		videoId: component.get("v.stepFields." + event.getSource().get("v.value"))
		// 	}
		// });
		// nav.fire();
	},

	doInit: function (component) {

		var action = component.get("c.getTrialActivityId");
		action.setStorable();
		action.setCallback(this, function (a) {
			var state = a.getState();
			if (state === "SUCCESS") {
				console.log(a.getReturnValue());
				var rec = component.find("trialRec");
				rec.set("v.recordId", a.getReturnValue());
				rec.reloadRecord();

				var rec2 = component.find("trialRecE");
				rec2.set("v.recordId", a.getReturnValue());
				rec2.reloadRecord();

			} else if (state === "ERROR") {
				console.log(a.getError());
			}
		});
		$A.enqueueAction(action);


	},

	//manual check from pushing the button
	check: function (component, event, helper) {
		helper.checkHelper(component);
	},

	locationChange: function (component, event, helper) {
		helper.urlCheck(component);
	},


})