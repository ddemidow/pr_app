public class Utils
{
    public enum ActionType
    {
        USER_LOGIN
    }
    
    public static Map<String, ActionType> actionMapping {
        public get
        {
            if (actionMapping == null)
            {
                actionMapping = new Map<String, ActionType>
                {
                    'user-login' => ActionType.USER_LOGIN
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
