public with sharing class TrialActivityHelper {

	@AuraEnabled
	public static list<Path_Activity__c> getAllWithStatus(){
		return [select id, Name, Description__c, Completed__c, Path_Name__c, Path_Sequence__c from Path_Activity__c];
	}

	@AuraEnabled
	public static list<Path_Activity__c> getAllAssigned(){
		return null;
	}

}