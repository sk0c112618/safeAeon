({
	positive : function(component) {
		component.set("v.rating", "Positive");
	},

	neutral : function(component) {
		component.set("v.rating", "Neutral");
	},

	negative : function(component) {
		component.set("v.rating", "Negative");
	},

	sendMore : function(component) {
		component.set("v.rating", null);
		component.set("v.comments", null);
		component.set("v.sent", false);
	},

	send : function(component) {
		let action = component.get("c.postFeedback");
		action.setParams({
			"rating" : component.get("v.rating"),
			"comments" : component.get("v.comments")
		});
		action.setCallback(this, function(a){
			let state = a.getState();
			if (state === "SUCCESS") {
				console.log(a.getReturnValue());
				component.set("v.sent", true);
			}  else if (state === "ERROR") {
				console.log(a.getError());
			}
		});
		$A.enqueueAction(action);

	},


})