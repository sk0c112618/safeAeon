public with sharing class TrialUtilities {

	@AuraEnabled
	public static string getUserId() {
		return UserInfo.getUserId();
	}

	@AuraEnabled
	public static void nextTask(){
		StepTests.nextTask();
	}

	@AuraEnabled
	public static string nextTaskId(){
		return StepTests.readNextTask();
	}

	@AuraEnabled
	public static string getTrialActivityId(){
		Trial_Activity__c TA = [select id, Current_Step__c, Paths_Chosen__c from Trial_Activity__c][0];

		// //if there isn't a current step, we'll set it to the default one
		// if (TA.Current_Step__c == null && TA.Paths_Chosen__c){
		// 	Path_Activity__c PA = [select Id from Path_Activity__c where Path_Sequence__c = 1];
		// 	TA.Current_Step__c = PA.Id;
		// 	update TA;
		// }

		return TA.Id;

	}

	@AuraEnabled
	public static list<Walkthrough__c> getWalkthroughsByActivity(id activityId){
		return [select Id, Name, BodyText__c, CSS__c, Header__c, Open_on_RecordId__c, Open_on_URL__c, OffsetX__c, OffsetY__c,
			Next_Button_Action_Override__c, Next_Button_Label__c, Selector__c, Sequence__c, Show_Close_Button__c, Show_Next_Button__c, Close_Message__c
			from Walkthrough__c
			where Activity__c =: activityId and Completed__c = false and Active__c=true
			order by Sequence__c ASC];
	}

	@AuraEnabled
	public static list<Walkthrough__c> getWalkthroughsByGrouping(string manualGrouping){
		return [select Id, Name, BodyText__c, CSS__c, Header__c, Open_on_RecordId__c, Open_on_URL__c, OffsetX__c, OffsetY__c,
			Next_Button_Action_Override__c, Next_Button_Label__c, Selector__c, Sequence__c, Show_Close_Button__c, Show_Next_Button__c, Close_Message__c
			from Walkthrough__c
			where Manual_Grouping__c =: manualGrouping and Completed__c = false and Active__c=true
			order by Sequence__c ASC];
	}


	public static final string MissionName = 'E.V.I.L. HQ Raid';
	//public static final	id articleId = 'ka0f4000000dJfoAAE';
	public static final string targetCity = 'City of San Francisco';


	public static void reset(){

		//sfmayor
		list<contact> matches = [select id, firstname, lastname, mobilephone, email, accountId from contact where firstname = 'Ed' and lastname = 'Lee'];
		delete matches;

		//heroes
		delete [select id from Assignment__c where Mission__r.Name =: MissionName];

		//equipment
		delete [select id from Equipment_Needed__c where Mission__r.Name =: MissionName];

		// list<Path_Activity__c> PAs = [select id, Completed__c from Path_Activity__c];
		// for (Path_Activity__c pa:PAs){
		// 	pa.Completed__c = false;
		// }
		// update PAs;

		// Trial_Activity__c ta = [select id, Current_Step__c from Trial_Activity__c];
		// //TODO: make this based on your chosen path
		// ta.Current_Step__c = null;
		// update ta;

		//chatter on mission
		id MissionId = [select Id from Mission__c where Name =: MissionName].Id;
		list<Assignment__c> assignments = [select id from Assignment__c];
		delete [select id from feedItem where parentId =: MissionId or parentId in: assignments];

	}

	@AuraEnabled
	public static Id noTest(){
		// nextTask();
		// return true;
		return readNextTask();
	}

	@AuraEnabled
	public static Id checkEquipment(){
		list<Equipment_Needed__c> needed = [select Id, Quantity__c, Equipment__r.Name__c from Equipment_Needed__c where Mission__r.Name =: MissionName];
		if (needed.size()<3){
			throw new AuraHandledException('There should be 3 pieces of equipment assigned');
		}

		for (Equipment_Needed__c e:needed){
			if (e.Equipment__r.Name__c == 'Binoculars'){
				if (e.Quantity__c != 2){
					throw new AuraHandledException('Doesn\'t look right.  Check the number of Binoculars');
				}
			} else if (e.Equipment__r.Name__c == 'Granola Bars'){
				if (e.Quantity__c != 5){
					throw new AuraHandledException('Doesn\'t look right.  Check the number of Granola Bars');
				}
			} else if (e.Equipment__r.Name__c == 'Grappling Hooks'){
				if (e.Quantity__c != 3){
					throw new AuraHandledException('Doesn\'t look right.  Check the number of Grappling Hooks');
				}
				//system.assert(e.Quantity__c == 3, 'Doesn\'t look right.  Check the number of Grappling Hooks');
			} else {
				throw new AuraHandledException('Hey!  We\'re running a scrappy, lean organization here.  No unauthorized requisitions like ' + e.Equipment__r.Name__c);
				//system.assert(false, 'Hey!  We\'re running a scrappy, lean organization here.  No unauthorized requisitions like ' + e.Equipment__r.Name__c);
			}
		}
		// nextTask();
		// return true;
		return readNextTask();
	}

	@AuraEnabled
	public static Id checkHeroes(){
			list<Assignment__c> heroes = [select id from Assignment__c where Mission__r.Name =: MissionName];
			if (heroes.size() < 2){
				throw new AuraHandledException('You need to assign at least 2 heroes to the mission');
			}
			//system.assert(heroes.size() >=2, 'You need to assign at least 2 heroes to the mission');
			// nextTask();
			// return true;
			return readNextTask();
	}

	@AuraEnabled
	public static Id checkSFmayor() {

		list<contact> matches = [select id, firstname, lastname, mobilephone, email, account.Name from contact where firstname = 'Ed' and lastname = 'Lee'];
		//system.assert(matches.size() > 0, 'You don\'t have a contact named Ed Lee created');
		if (matches.size() ==0){
			throw new AuraHandledException('You don\'t have a contact named Ed Lee created');
		}
		contact c = matches[0];

		if (c.Account.Name != targetCity){
			throw new AuraHandledException('You have Ed Lee as a contact, but not at the right Account (' + targetCity + ')');
		}

		//at this point, we're good!
		// nextTask();
		// return true;
		return readNextTask();

	}

	@AuraEnabled
	public static Id checkArticleQuestion(){

		//TODO: search for article by name/id, then view it's feed
		list<feeditem> questions = [select id from feeditem where type='QuestionPost' and NetworkScope !=null];
		if (questions.size()==0){
			throw new AuraHandledException('There doesn\'t seem to be a question posted in the community');
		}
		//system.assert(questions.size()>0, 'There doesn\'t seem to be a question posted in the community');
		// nextTask();
		// return true;
		return readNextTask();

	}


	public static id readNextTask(){
		Trial_Activity__c ta = [select id, Current_Step__c from Trial_Activity__c];

		if (ta.Current_Step__c==null){
			list<Path_Activity__c> paNext = [select id, Path_Sequence__c, Path_Name__c
			from Path_Activity__c
				where Completed__c = false
				and Active__c = true
			order By Path_Sequence__c ASC];
			return paNext[0].Id;
		}
		// marks the task complete
		Path_Activity__c paNow = [select id, Completed__c, Path_Sequence__c, Path_Name__c from Path_Activity__c where id =:ta.Current_Step__c];
		// if (paNow != null){
		// 	paNow.Completed__c = true;
		// 	update paNow;
		// }
		//handling for nulls


		// gets the next task
		list<Path_Activity__c> paNext = [select id, Path_Sequence__c, Path_Name__c
			from Path_Activity__c
			where Path_Sequence__c >: paNow.Path_Sequence__c
				// and Path_Name__c =: paNow.Path_Name__c
				and Assigned__c = true
				and Active__c = true
				and Completed__c = false
			order By Path_Sequence__c ASC];

		if (paNext.size()==0){
			//then we're done!
			PaNext = [select Id from Path_Activity__c where Name = 'Complete'];
		}

		//update step (move to conroller)
		// ta.Current_Step__c = paNext[0].Id;
		// update ta;

		return paNext[0].Id;
	}
}