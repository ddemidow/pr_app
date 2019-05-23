public with sharing class ProductsSearchService
{
    public static  List<List<Product_Field__c>> searchProducts(Set<Id> categoryIds, List<ProductListController.FilterInstanse> filters)
    {
        String query = 'SELECT Value__c, Product__c, Product_Configuration__r.Api_Name__c FROM Product_Field__c WHERE ';
        
        for (ProductListController.FilterInstanse currentFilter : filters)
        {
            String value = currentFilter.value;
            String apiName = currentFilter.key;
            Integer valueIndex = 0;
            
            while (valueIndex < value.length())
            {
                Integer appostropheIndex = value.indexOfChar(Utils.APOSTROPHE_CHAR_NUMBER, valueIndex);
        
                if (appostropheIndex != -1)
                {
                    value = value.substring(0, appostropheIndex) + '\\' + value.substring(appostropheIndex, value.length());
                    valueIndex = appostropheIndex + 2;
                }
                else
                {
                    break;
                }
            }
            
            query += '( Product_Configuration__r.Api_Name__c = ' + '\'' + apiName + '\' AND Value__c = ' + '\'' + value + '\') OR';
        }
        
        query = query.substring(0, query.length()-2);
        query += ' AND Category__c IN :categoryIds ORDER BY Product__c, Product_Configuration__r.Api_Name__c asc';
        
        List<Product_Field__c> productFields = (List<Product_Field__c>)Database.query(query);
        
        Map<Id, List<Product_Field__c>> valuesByProduct = new Map<Id, List<Product_Field__c>>();
        
        for (Product_Field__c currentField : productFields)
        {
            if (!valuesByProduct.containsKey(currentField.Product_Configuration__r.Api_Name__c))
            {
                valuesByProduct.put(currentField.Product_Configuration__r.Api_Name__c, new List<Product_Field__c>());
            }
            
            valuesByProduct.get(currentField.Product_Configuration__r.Api_Name__c).add(currentField);
        }
        
        return valuesByProduct.values();
    }
}
