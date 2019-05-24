public with sharing class ProductsSearchService
{
    public static  List<List<Product_Field__c>> searchProducts(Set<Id> categoryIds, List<List<String>> filters)
    {
        String query = 'SELECT Value__c, Product__c, Product_Configuration__r.Api_Name__c FROM Product_Field__c WHERE (';
        
        for (List<String> currentFilter : filters)
        {
            String value = currentFilter[1];
            String apiName = currentFilter[0];
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
    
        if (!filters.isEmpty())
        {
            query = query.substring(0, query.length()-2) + ') AND ( ';
        }
        
        query += '  Product__r.Category__c IN :categoryIds) ORDER BY Product__c, Product_Configuration__r.Api_Name__c ASC';
        
        System.debug(query);
        
        List<Product_Field__c> productFields = (List<Product_Field__c>)Database.query(query);
        
        System.debug(productFields);
        
        Map<Id, List<Product_Field__c>> valuesByProduct = new Map<Id, List<Product_Field__c>>();
        
        for (Product_Field__c currentField : productFields)
        {
            if (!valuesByProduct.containsKey(currentField.Product__c))
            {
                valuesByProduct.put(currentField.Product__c, new List<Product_Field__c>());
            }
            
            valuesByProduct.get(currentField.Product__c).add(currentField);
        }
        
        System.debug(valuesByProduct.values());
        
        return valuesByProduct.values();
    }
}
