public with sharing class ManageProductController implements Callable
{
    public Object call(String action, Map<String, Object> args)
    {
        Utils.ActionType actionType = Utils.getActionType(action);
        
        switch on actionType
        {
            when GET_CATEGORIES_LIST
            {
                return this.getCategoriesList();
            }
            when DELETE_CATEGORY
            {
                this.deleteCategory((String)args.get('categoryId'));
                return null;
            }
            when GET_PRODUCT_CONFIGS_LIST
            {
                return this.getConfigList();
            }
            when DELETE_PRODUCT_CONFIG
            {
                this.deleteFieldConfig((String)args.get('configId'));
                return null;
            }
            when else {
                return null;
            }
        }
    }
    
    private List<Category__c> getCategoriesList()
    {
        List<Category__c> categories = [
            SELECT Id, Name, Master_Category__c, Master_Category__r.Name
            FROM Category__c
            ORDER BY Name
        ];

        System.debug(categories);
        
        return categories;
    }
    
    private List<Product_Configuration__c> getConfigList()
    {
        List<Product_Configuration__c> configs = [
            SELECT Id, Name, Type__c, Api_Name__c, Description__c
            FROM Product_Configuration__c
            ORDER BY Name
        ];
        
        System.debug(configs);
        
        return configs;
    }
    
    private void deleteFieldConfig(Id configId)
    {
        Product_Configuration__c config = new Product_Configuration__c(Id = configId);
        
        delete config;
        
        //TODO remove values from all products
    }
    
    private void deleteCategory(Id categoryId)
    {
        Category__c category = new Category__c(Id = categoryId);
        
        delete category;
    }
}
