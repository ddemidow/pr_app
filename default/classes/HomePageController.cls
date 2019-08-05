public with sharing class HomePageController implements Callable
{
    public Object call(String action, Map<String, Object> args)
    {
        Utils.ActionType actionType = Utils.getActionType(action);
        
        
        switch on actionType
        {
            when CHECK_PASSWORD
            {
                return this.checkUserPassword((String)args.get('userId'), (String)args.get('password'));
            }
            when else
            {
                return null;
            }
        }
    }
    
    private Boolean checkUserPassword(Id userId, String password)
    {
        List<User__c> users = [
            SELECT Id, Password__c
            FROM User__c
            WHERE Id = :userId
        ];
        
        if (users.isEmpty())
        {
            throw new NoUserException();
        }
        else
        {
            if (password == users[0].Password__c)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
    
    class NoUserException extends Exception {}
}
