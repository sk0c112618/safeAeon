({
	doInit : function(component, event, helper) {
		//get the equipment list
		let action = component.get("c.getAllEquipment");
		action.setCallback(this, function(a){
			let state = a.getState();
			if (state === "SUCCESS") {
				let equipment = JSON.parse(a.getReturnValue());
				console.log(equipment);
				component.set("v.allEquipment", equipment);
				helper.filter(component);
			} else if (state === "ERROR") {
				console.log(a.getError());
			}
		});
		$A.enqueueAction(action);
	},

	callFilter : function(component, event, helper) {
		helper.filter(component);
	},

	select : function(component, event) {
		//console.log("selected!");
		//console.log(event.target.id);
		//init a new record
		component.find("nme").getNewRecord("Equipment_Needed__c", null, false, $A.getCallback(function(){

			console.log(component.get("v.newMissionEquipment"));
			console.log(component.get("v.newMissionEquipmentError"));

			component.set("v.selectedItem", _.find(component.get("v.allEquipment"), { Id: event.target.id}));
			component.set("v.newMissionEquipment.Mission__c", component.get("v.recordId"));
			component.set("v.newMissionEquipment.Equipment__c", component.get("v.selectedItem.Id__c").toString());
		}));
	},

	addItems : function(component, event, helper) {
		let equipment = component.get("v.allEquipment");
		let index = _.findIndex(equipment, {"Id__c" : component.get("v.selectedItem").Id__c});
		equipment[index].Available_quantity__c = equipment[index].Available_quantity__c - component.get("v.newMissionEquipment").Quantity__c;

		//set in array so we can union with existing equipment arrays
		component.set("v.allEquipment", equipment);
		helper.filter(component);

    component.find("nme").saveRecord(function(saveResult) {
    	if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
				//subtract the quantity ordered

				//reset the selected item so user can add more
				component.set("v.selectedItem", null);
        $A.get('e.force:refreshView').fire();
    	} else if (saveResult.state === "ERROR"){
    		console.log(saveResult.error);
    	}
    });

		//set the FRD field values, then save the new record and reload our details?
	},

	cancel : function(component, event, helper) {
		component.set("v.selectedItem", null);
	},



})