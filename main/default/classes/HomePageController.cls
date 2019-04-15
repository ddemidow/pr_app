public with sharing class HomePageController implements Callable
{
    public Object call(String action, Map<String, Object> args)
    {
        Utils.ActionType actionType = Utils.getActionType(action);
        
        switch on actionType
        {
            when USER_LOGIN
            {
                return null;
            }
            when else
            {
                return null;
            }
        }
    }
}
