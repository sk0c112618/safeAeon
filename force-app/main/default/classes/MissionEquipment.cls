public with sharing class MissionEquipment {

	@AuraEnabled
	public static string getAllEquipment(){
		list<Equipment__x> output = [select id, Id__c, Name__c, Type__c, Image__c, Available_quantity__c, Description__c from Equipment__x];
		return JSON.serialize(output);
	}

}