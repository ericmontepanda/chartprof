public with sharing class PF_User_Statistics {
    @AuraEnabled (cacheable=true)
    public static integer getActiveUsers(){
        return  [select count() from user where isActive =true and  Profile.Name != null];
    }

    @AuraEnabled (cacheable=true)
    public static integer getActiveAdminUsers(){
        return  [select count() from user where isActive =true and Profile.Name = 'System Administrator'];
    }

    @AuraEnabled (cacheable=true)
    public static list <ProfileData> getUserProfile(string obj){
    //public static list <ProfiledData> getUserProfile(){
        List <ProfileData> pdatalist = new List <ProfileData>();
        AggregateResult[] groupedResults =[SELECT Profile.Name,Profile.id, Count(Id) co from User where isActive = true and  Profile.Name != null
        group by Profile.Name, Profile.id];
        for (AggregateResult ar : groupedResults)  {
            ProfileData pdata = new ProfileData();
            
            System.debug('Count' + ar.get('co'));
            System.debug('Group Name' + ar.get('Name') +' ' +ar.get('Id'));
            pdata.profileName =  String.valueof(ar.get('Name'));
            pdata.countUsers = Integer.valueof(ar.get('co'));
            pdata.profileId = String.valueof(ar.get('Id'));
            pdatalist.add(pdata);
        }
        return pdatalist;
    }

    public class ProfileData{
        @AuraEnabled
        public String profileName {get;set;}
        @AuraEnabled
        public integer countUsers {get;set;}
        @AuraEnabled
        public string profileId {get;set;}
    }
}
