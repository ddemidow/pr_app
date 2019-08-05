public with sharing class ManageUsersController implements Callable
{
    public Object call(String action, Map<String, Object> args)
    {
        Utils.ActionType actionType = Utils.getActionType(action);
        
        switch on actionType
        {
            when GET_USERS_LIST
            {
                return this.getUsers();
            }
            when DELETE_USER
            {
                this.deleteUser((String)args.get('userId'));
                return null;
            }
            when else {
                return null;
            }
        }
    }
    
    private List<User__c> getUsers()
    {
        List<User__c> users = [
            SELECT Id, Name, Username__c, Email__c, User_Role__r.Name, User_Role__c
            FROM User__c
            WHERE User_Role__c != null
            ORDER BY Name
            LIMIT 1000
        ];
        
        System.debug(users);
        
        return users;
    }
    
    private void deleteUser(Id userId)
    {
        User__c user = new User__c(Id = userId);
        
        delete user;
    }
}
