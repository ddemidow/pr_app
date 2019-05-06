public with sharing class ProductListController implements Callable
{
    public Object call(String action, Map<String, Object> args)
    {
        Utils.ActionType actionType = Utils.getActionType(action);
        
        switch on actionType
        {
            when GET_CHILD_CATEGORIES
            {
                return this.getChildCategories((String)args.get('categoryId'));
            }
            when else
            {
                return null;
            }
        }
}
    
    private List<Category__c> getChildCategories(Id masterId)
    {
        List<Category__c> categories = [
            SELECT Id, Name
            FROM Category__c
            WHERE Master_Category__c = :masterId
        ];
        
        return categories;
    }
}
