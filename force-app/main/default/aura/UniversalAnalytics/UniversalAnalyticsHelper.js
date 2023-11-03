({
	sendPage : function(component, pageName, pageTitle) {
		let action = component.get("c.pageHit");
		action.setParams({
			"pageName" : pageName,
			"pageTitle" : pageTitle
		});
		this.sendEverything(action);
	},

	sendEvent : function(component, category, action, label) {
		//public static void eventHit(string category, string action, string label) {
		let event = component.get("c.eventHit");
		event.setParams({
			"category" : category,
			"action" : action,
			"label" : label
		});

		this.sendEverything(event);
	},

	sendEverything : function(action) {
		action.setBackground();
		action.setCallback(this, function(a){
			if (a.getState() === "SUCCESS") {
				// console.log(a.getReturnValue());
			}  else if (a.getState() === "ERROR") {
				console.log(a.getError());
			}
		});
		$A.enqueueAction(action);
	},


})