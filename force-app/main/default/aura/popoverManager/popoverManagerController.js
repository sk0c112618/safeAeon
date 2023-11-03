({
    doInit : function(component, event, helper) {
        console.log("popover manager is init");
        // if (component.get("v.startOnInit")){
        //     helper.nextPopover(component);
        // }
    },

    go : function(component, event, helper) {
        console.log('starting popover in go function');
        helper.nextPopover(component);
    },

    // basically a re-init when the task changes.
    empty : function(component, event, helper) {
        console.log('emptying popovers');
        component.set("v.popovers", []);
        component.set("v.activePopover", -1);
    },

    add : function(component, event) {
        console.log("popovers were");
        var existing = component.get("v.popovers");
        console.log(existing);

        var newP = event.getParam("arguments").newPopovers;
        component.set("v.popovers", existing.concat(newP));

        console.log("then popovers changed to");
        console.log(component.get("v.popovers"));
    },

    next: function(component, event, helper) {
        console.log('popover next function');
        helper.nextPopover(component);
    }
})