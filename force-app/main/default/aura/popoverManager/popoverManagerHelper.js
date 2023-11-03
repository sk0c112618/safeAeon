({
    nextPopover : function(component) {
        console.log('in next popover');
        var self = this;
        this.markComplete(component);

        //are we done with all of them?  If so, stop now (and close the popover!)
        if (component.get("v.activePopover")+1 >= component.get("v.popovers").length){
            return;
        }

        //set the next popover
        component.set("v.activePopover", component.get("v.activePopover") + 1 );
        console.log("active popover is " + component.get("v.activePopover"));

        var popovers = component.get("v.popovers");
        var current = popovers[component.get("v.activePopover")];

        console.log('current popover is:');
        console.log(current);

        component.find("frdE").set("v.recordId", current.Id);
        component.find("frdE").reloadRecord();

        //delay to hope it's there yet if it's the first popover
        if (component.get("v.activePopover")===0){
            window.setTimeout($A.getCallback(function (){
                console.log('executing delay');
                self.hitPopover(component);
            }), 1000);
        } else {
            self.hitPopover(component);
        }

    },

    markComplete: function (component) {
        //update the last popover
        if (component.get("v.activePopover")>=0){
            component.set("v.targetFields.Completed__c", true);
            component.find("frdE").saveRecord(
                $A.getCallback(function(saveResult){
                    //console.log(saveResult);
                    if (saveResult.state === "SUCCESS"){

                    } else if (saveResult.state === "INCOMPLETE") {
                        console.log("User is offline, device doesn't support drafts.");
                    } else if (saveResult.state === "ERROR"){
                        component.find("leh").passErrors(saveResult.error);
                    }
                })
            );
        }
    },

    hitPopover : function(component) {
        console.log('hit popovers called');

        var popovers = component.get("v.popovers");
        var current = popovers[component.get("v.activePopover")];

        var cssClass = current.CSS__c + ',cPopoverManager';
        console.log('creating popover with ' + cssClass);
        console.log(component.get("v.activePopover"));


        $A.createComponent(
            "c:walkthroughNode",
            {
                "walkthroughId": current.Id,
                "stepNumber": component.get("v.activePopover") + 1,
                "stepCount": popovers.length,
                "nextAction": current.Next_Button_Action_Override__c || component.get("c.next")
            },
            function (node, status) {
                if (status === "SUCCESS") {
                    component.find('overlayLib').showCustomPopover({
                        body: node,
                        //always add the component's name, with letter after c capitalized, so CSS works
                        referenceSelector: current.Selector__c,
                        cssClass: cssClass
                    }).then(function (popover){
                        console.log(popover);
                        // the following is not part of the real API for this and should not be used for real apps
                        let elements;
                        if (popover._panelInstance.elements){ //regular mode
                            elements = popover._panelInstance.elements;
                        } else if (popover._panelInstance.$allElements$){
                            elements = popover._panelInstance.$allElements$ //debug mode
                        }
                        console.log(elements[0].style);
                        setTimeout(() => {
                            elements[0].style.setProperty('transform', `translate(${current.OffsetX__c || 0}px,${current.OffsetY__c || 0}px)`);
                        }, 150);
                    })
                }
            }
        )
    },
})