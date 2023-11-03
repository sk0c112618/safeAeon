({
	doInit : function(component, event, helper) {
		let action = component.get("c.pageHit");
		action.setParams({
			"pageName" : component.get("v.pageName"),
			"pageTitle" : component.get("v.pageTitle")
		});
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