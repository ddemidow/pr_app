public with sharing class ProductListController
{
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
