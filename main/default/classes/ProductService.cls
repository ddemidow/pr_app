global with sharing class ProductService
{
    public static List<Product2> getUpdatedRecords(List<Product2> newProducts, Map<Id, Product2> oldProductsById, List<String> fieldNames)
    {
        Map<Id, Product2> updatedCreditApplications = new Map<Id, Product2>();
        
        for (Product2 currentProduct : newProducts)
        {
            for (String currentFieldName : fieldNames)
            {
                if (oldProductsById.get(currentProduct.Id).get(currentFieldName) != currentProduct.get(currentFieldName))
                {
                    updatedCreditApplications.put(currentProduct.Id, currentProduct);
                }
            }
        }
        
        return updatedCreditApplications.values();
    }
    
    global static void assignProductOnCategories(List<Product2> products)
    {
        Set<Id> categoryIds = new Set<Id>();

        for (Product2 currentProduct : products)
        {
            categoryIds.add(currentProduct.Category__c);
        }

        List<Product_To_Category__c> productToCategoriesForDelete = [
                SELECT Id
                FROM Product_To_Category__c
                WHERE Product__c IN : products
        ];

        delete productToCategoriesForDelete;

        Map<Id, List<Id>> parentCategories = getParentCategories(categoryIds, null);
        List<Product_To_Category__c> productToCategoriesForInsert = new List<Product_To_Category__c>();

        for (Product2 currentProduct : products)
        {
            for (Id currentCategoryId : parentCategories.get(currentProduct.Category__c))
            {
                productToCategoriesForInsert.add(new Product_To_Category__c(
                        Category__c = currentCategoryId,
                        Product__c = currentProduct.Id
                ));
            }
        }

        insert productToCategoriesForInsert;
    }

    public static Map<Id, List<Id>> getParentCategories(Set<Id> categoryIds, Map<Id, List<Id>> result)
    {
        if (result == null)
        {
            result = new Map<Id, List<Id>>();
        }

        String parentFieldName = 'Master_Category__r';

        List<Category__c> categoriesWithParentInfo = [
                SELECT  Id,
                        Master_Category__c,
                        Master_Category__r.Master_Category__c,
                        Master_Category__r.Master_Category__r.Master_Category__c,
                        Master_Category__r.Master_Category__r.Master_Category__r.Master_Category__c,
                        Master_Category__r.Master_Category__r.Master_Category__r.Master_Category__r.Master_Category__c,
                        Master_Category__r.Master_Category__r.Master_Category__r.Master_Category__r.Master_Category__r.Master_Category__c
                FROM Category__c
                WHERE Id IN :categoryIds
        ];

        Map<Id, Id> idOfLastParentToFirst = new Map<Id, Id>();

        System.debug(categoriesWithParentInfo.size());

        for (Category__c currentCategory : categoriesWithParentInfo)
        {
            result.put(currentCategory.Id, New List<Id>{currentCategory.Id});
            Category__c parent = currentCategory;

            for (Integer parentLevel = 0; parentLevel < 5; parentLevel++)
            {
                System.debug(parentLevel);


                parent = (Category__c)parent.getSObject(parentFieldName);


                System.debug(parent);

                if (parent == null)
                {
                    break;
                }



                if (parentLevel == 4)
                {
                    idOfLastParentToFirst.put(parent.Id, currentCategory.Id);
                }

                result.get(currentCategory.Id).add(parent.Id);
            }
        }

        if (!idOfLastParentToFirst.isEmpty())
        {
            System.debug('here');

            Map<Id, List<Id>> newResults = getParentCategories(idOfLastParentToFirst.keySet(), result);

            for (Id currentParentId : idOfLastParentToFirst.keySet())
            {
                result.get(idOfLastParentToFirst.get(currentParentId)).addAll(newResults.get(currentParentId));
            }
        }

        return result;
    }
}
