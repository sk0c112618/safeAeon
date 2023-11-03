({
	doInit : function(component, event, helper) {
		//	sendEvent : function(component, category, action, label) {

		helper.sendEvent(component, 'tracker' + component.get("v.location"), 'init', 'tracker started');
	},

	moved : function(component, event, helper) {
		// console.log(event.getParam("token"));
		// console.log(event.getParam("querystring"));
		//	sendPage : function(component, pageName, pageTitle) {

		helper.sendPage(component, event.getParam("token"), event.getParam("querystring"));
	},

	movedCommunity : function(component, event, helper) {
		// console.log(event.getParams());
		// console.log(window.location.pathname);
		// console.log(document.title);
		helper.sendPage(component, window.location.pathname, document.title);
	},

	handleError : function(component, event, helper) {
		helper.sendEvent(component, 'error', 'error', event.getParam("message"));
	},

	handleEvent : function(component, event, helper) {
		const args = event.getParam('arguments');
		console.log('args passed to the UA controller');
		console.log(args.category);
		console.log(args.action);
		console.log(args.label);
		helper.sendEvent(component, args.category, args.action, args.label);
	},




})