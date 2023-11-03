public with sharing class AssignmentManager {

    @InvocableMethod (label='Assign Steps' description='Based on the path checkboxes on the Trial Activity, assign the path activities')
    public static void SetAssignments (){
        List<Trial_Activity__c> trials = [select id, Path_Build_Apps__c, Path_Mobile__c, Path_See_Apps__c, Path_IT_Tools__c from Trial_Activity__c limit 1];
        Trial_Activity__c trial = trials[0];

        List<Path_Activity__c> data = [select id, Assigned__c, Path_Name__c from Path_Activity__c];

        for (Path_Activity__c p:data){

            if (p.Path_Name__c == 'See Apps' && trial.Path_See_Apps__c){
                p.Assigned__c = true;
            } else if (p.Path_Name__c == 'Build Apps' && trial.Path_Build_Apps__c){
                p.Assigned__c = true;
            } else if (p.Path_Name__c == 'Mobile' && trial.Path_Mobile__c){
                p.Assigned__c = true;
            } else  if (p.Path_Name__c == 'IT Tools' && trial.Path_IT_Tools__c){
                p.Assigned__c = true;
            } else  if (p.Path_Name__c == null){
                // by default, no-path means for everybody, like Complete
                p.Assigned__c = true;
            }
        }
        update data;
    }
}