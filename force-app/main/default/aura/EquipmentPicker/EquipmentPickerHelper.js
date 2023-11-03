({
	filter : function(component) {
		if (component.get("v.searchText")){
			let goodStuff = _.filter(component.get("v.allEquipment"), function(record){
				let contains = false;
				_.forEach(record, function(value){
        	contains = contains || _.includes(_.lowerCase(_.toString(value)), _.lowerCase(component.get("v.searchText")));
				});
				return contains;
			});
			component.set("v.filteredEquipment", goodStuff);
		} else {
			//no searchText...just dump them in
			component.set("v.filteredEquipment", component.get("v.allEquipment"));
		}
	}
})