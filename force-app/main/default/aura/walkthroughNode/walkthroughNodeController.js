({
    next : function(component) {
        var action = component.get("v.nextAction");
        $A.enqueueAction(action);
        component.find("overlayLib").notifyClose();
    },

    close: function (component) {
        var action = component.get("v.nextAction");
        $A.enqueueAction(action);
        component.find("overlayLib").notifyClose();
    },

    handleEvent : function(component, event){
        console.log("received event in walkthrough");
        console.log(event);
        if (event.getParam("channel")==="trialMessages"){
            console.log("channel match");
            if (event.getParam("message")){
                console.log("has message :");
                console.log(event.getParam("message"));
                console.log("does it match closeMessage--" + component.get("v.targetFields.Close_Message__c"));
                if (event.getParam("message") === component.get("v.targetFields.Close_Message__c")){
                    var action = component.get("v.nextAction");
                    $A.enqueueAction(action);

                    console.log("trying to do a close action");
                    //this needs to close itself
                    component.find("overlayLib").notifyClose();
                }
            }
        }
    }
})