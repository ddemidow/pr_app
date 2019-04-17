public with sharing class LoginController implements Callable {
    public Object call(String action, Map<String, Object> args)
    {
        Utils.ActionType actionType = Utils.getActionType(action);
        
        switch on actionType
        {
            when USER_LOGIN
            {
                return this.login((String)args.get('username'), (String)args.get('password'));
            }
            when else {
                return null;
            }
        }
    }

    public Object login(String userName, String password)
    {
        List<User__c> users = [
            SELECT Id, User_Role__r.Name, Username__c, Name, Password__c, Main_Company__c
            FROM User__c
            WHERE Username__c = :userName
        ];
        
        if (users.isEmpty())
        {
            return 'Invalid username';
        }
        else
        {
            User__c user = users[0];
            
            if (user.Password__c == password)
            {
                System.debug(user);
                return user;
            }
            else
            {
                return 'Invalid password';
            }
        }
    }
}
