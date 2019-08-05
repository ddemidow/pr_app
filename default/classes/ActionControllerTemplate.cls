public with sharing class ActionControllerTemplate {
	@AuraEnabled(cacheable=true)
	public static Object invokeCachableAction(String actions)
	{
		return processActions(actions);
	}
	
	@AuraEnabled
	public static Object invokeAction(String actions)
	{
		return processActions(actions);
	}
	
	
	private static Object processActions(String actions)
	{
		System.debug(actions);
		List<ActionWrapper> actionWrappers = (List<ActionWrapper>)JSON.deserialize(actions, List<ActionWrapper>.class);
		
		List<String> callableClasses = new List<String>();
		
		for (ActionWrapper currentWrapper : actionWrappers)
		{
			callableClasses.add(currentWrapper.className);
		}
		
		Map<String, Callable> callables = generateActions(callableClasses);
		List<Object> results = new List<Object>();
		
		for (ActionWrapper currentWrapper : actionWrappers)
		{
			results.add(callables.get(currentWrapper.className).call(currentWrapper.action, currentWrapper.args));
		}
		
		return results;
	}
	
	private static Map<String, Callable> generateActions(List<String> classNames)
	{
		Map<String, Callable> actionsByName = new Map<String, Callable>();
		
		for (String currentClassName : classNames)
		{
			actionsByName.put(currentClassName, (Callable)Type.forName(currentClassName).newInstance());
		}
		
		return actionsByName;
	}
    
    public class ActionWrapper
    {
        @AuraEnabled public String className;
        @AuraEnabled public String action;
        @AuraEnabled public Map<String, String> args;
    }
}
