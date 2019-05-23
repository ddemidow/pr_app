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
            when RECIEVE_PRODUCTS
            {
                return this.retrieveProducts((String)args.get('categoryIds'), (String)args.get('filters'));
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
    
    private List<List<Product_Field__c>> retrieveProducts(String filtersSer, String categoryIdsSer)
    {
        List<FilterInstanse> filters = (List<FilterInstanse>)JSON.deserialize(filtersSer, List<FilterInstanse>.class);
        Set<Id> categoryIds = (Set<Id>)JSON.deserialize(categoryIdsSer, Set<Id>.class);
        
        return ProductsSearchService.searchProducts(categoryIds, filters);
    }
    
    public class FilterInstanse
    {
        public String key;
        public String value;
    }
}
