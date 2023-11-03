({
    doInit : function(component) {

        $A.createComponent(
            "c:TrialWelcome2",
            {},
            function(content, status){
                if (status === "SUCCESS"){
                    component.find("overlayLib").showCustomModal({
                        body : content,
                        cssClass: "slds-modal_large",
                        showCloseButton: false//,
                        // closeCallback: function() {
                        //     component.find("pom").startPopovers();
                        // }
                    });
                }
            }
        );
    },
})