({
	doneYet : function(component, event) {
		// check on load
		console.log('checking loaded record');
		console.log(event.getParams().changeType);
		if (event.getParams().changeType === "LOADED"){
			console.log('record loaded');
			console.log(component.get("v.trialFields"));
			if (component.get("v.trialFields.Paths_Chosen__c") && component.get("v.trialFields.WelcomeViewed__c")){
				component.find("overlayLibModal").notifyClose();
			}
		}
	},

	updateRecord : function(component) {
		console.log("child component update succeeded");

		component.find("trialRecE").saveRecord(
			$A.getCallback(function(saveResult){
				//console.log(saveResult);
				if (saveResult.state === "SUCCESS"){
					//happy logic here
					component.find("trialRecE").reloadRecord();
				} else if (saveResult.state === "INCOMPLETE") {
					console.log("User is offline, device doesn't support drafts.");
				} else if (saveResult.state === "ERROR"){
					component.find("leh").passErrors(saveResult.error);
				}
			})
		);
	},

	select : function(component, event) {
		console.log(event);
		var field = event.getSource().get("v.value");
		console.log(field);
		//flip from selected to not
		component.set("v.trialFieldsE."+field, !component.get("v.trialFieldsE."+field));
	},

	//after you've done your orientation story
	storySet : function(component) {
		var action = component.get("c.nextTaskId");
		action.setCallback(this, function(a){
			console.log(a.getReturnValue());
			var state = a.getState();
			if (state === "SUCCESS") {
				component.set("v.trialFieldsE.Paths_Chosen__c", true);
				component.set("v.trialFieldsE.Current_Step__c", a.getReturnValue());

				component.set("v.trialFieldsE.Video_Watched__c", true);
				component.set("v.trialFieldsE.WelcomeViewed__c", true);
				component.set('v.trialFieldsE.Path_See_Apps__c', true);
				component.set('v.trialFieldsE.Path_Build_Apps__c', true);

				component.find("trialRecE").saveRecord(
					$A.getCallback(function (saveResult) {
						console.log(saveResult);
						if (saveResult.state === "SUCCESS") {
							//happy logic here
							component.find("trialRecE").reloadRecord();
							component.find("overlayLibModal").notifyClose();
							// component.find("pom").startPopovers();
						} else if (saveResult.state === "INCOMPLETE") {
							console.log("User is offline, device doesn't support drafts.");
						} else if (saveResult.state === "ERROR") {
							console.log(saveResult.getError());
							component.find("leh").passErrors(saveResult.error);
						}
					})
				);
			} else if (state === "ERROR") {
				console.log(a.getError());
			}
		});

		$A.enqueueAction(action);

	},

	//after you've done your orientation story
	// pathsSet: function (component) {
	// 	var action = component.get("c.nextTaskId");
	// 	action.setCallback(this, function(a){
	// 		console.log(a.getReturnValue());
	// 		var state = a.getState();
	// 		if (state === "SUCCESS") {
	// 			component.set("v.trialFieldsE.Paths_Chosen__c", true);
	// 			component.set("v.trialFieldsE.Current_Step__c", a.getReturnValue());
	// 			console.log(component.get("v.trialFieldsE"));

	// 			component.find("trialRecE").saveRecord(
	// 				$A.getCallback(function (saveResult) {
	// 					console.log(saveResult);
	// 					if (saveResult.state === "SUCCESS") {
	// 						//happy logic here
	// 						component.find("trialRecE").reloadRecord();
	// 						component.find("overlayLibModal").notifyClose();
	// 						// component.find("pom").startPopovers();
	// 					} else if (saveResult.state === "INCOMPLETE") {
	// 						console.log("User is offline, device doesn't support drafts.");
	// 					} else if (saveResult.state === "ERROR") {
	// 						console.log(saveResult.getError());
	// 						component.find("leh").passErrors(saveResult.error);
	// 					}
	// 				})
	// 			);
	// 		} else if (state === "ERROR") {
	// 			console.log(a.getError());
	// 		}
	// 	});
	// 	$A.enqueueAction(action);


	// },

	doInit : function(component) {

		var action = component.get("c.getTrialActivityId");
		action.setStorable();
		action.setCallback(this, function(a){
			var state = a.getState();
			if (state === "SUCCESS") {
				console.log(a);
				component.set("v.recordId", a.getReturnValue());

				var rec = component.find("trialRec");
				rec.set("v.recordId", a.getReturnValue());
				rec.reloadRecord();

				var recE = component.find("trialRecE");
				recE.set("v.recordId", a.getReturnValue());
				recE.reloadRecord();

			} else if (state === "ERROR") {
				console.log(a.getError());
			}
		});
		$A.enqueueAction(action);


	},

	// checkboxChange : function(component, event, helper) {
	// 	component.set('v.trialFieldsE.Path_See_Apps__c', document.getElementById("path_see").checked);
	// 	component.set('v.trialFieldsE.Path_Build_Apps__c', document.getElementById("path_build").checked);
	// },





})