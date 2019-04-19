public class Utils
{
    public enum ActionType
    {
        USER_LOGIN, CHECK_PASSWORD, GET_USERS_LIST, DELETE_USER
    }
    
    public static Map<String, ActionType> actionMapping {
        public get
        {
            if (actionMapping == null)
            {
                actionMapping = new Map<String, ActionType>
                {
                    'user-login' => ActionType.USER_LOGIN,
                    'check-password' => ActionType.CHECK_PASSWORD,
                    'get-users-list' => ActionType.GET_USERS_LIST,
                    'delete-user' => ActionType.DELETE_USER
                };
            }
            
            return actionMapping;
        }
        private set;
    }
    
    public static ActionType getActionType(String actionName)
    {
        ActionType actionType = actionMapping.get(actionName);
        
        if (actionType == null)
        {
            throw new ActionDoesNotSupportedException();
        }
        
        return actionType;
    }
    
    public class ActionDoesNotSupportedException extends Exception {}
}
