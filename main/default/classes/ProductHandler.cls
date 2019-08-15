public with sharing class ProductHandler implements TriggerTemplate.Handler
{
    private static Set<String> trackedFields = new Set<String>
    {
        'Category__c'
    };
    
    private List<Product2> newValues;
    private Map<Id, Product2> oldValues;

    public void setValues(List<sObject> newValues, Map<Id, sObject> oldValues)
    {
        this.newValues = newValues;
        this.oldValues = (Map<Id, Product2>) oldValues;
    }

    public void handle(TriggerTemplate.TriggerAction action)
    {
        if (action == TriggerTemplate.TriggerAction.afterinsert)
        {
            ProductService.assignProductOnCategories(newValues);
        }

        if (action == TriggerTemplate.TriggerAction.afterupdate)
        {
            Map<String, List<Product2>> updatedFields = getUpdatedFields(newValues, oldValues);
    
            ProductService.assignProductOnCategories(updatedFields.get('Category__c'));
        }
    }
    
    private static Map<String, List<Product2>> getUpdatedFields(List<Product2> newProducts, Map<Id, Product2> oldProducts)
    {
        Map<String, List<Product2>> updatedFieldToNewValues = new Map<String, List<Product2>>();
        
        for (String currentFieldName : trackedFields)
        {
            List<Product2> updatedValues = ProductService.getUpdatedRecords(newProducts, oldProducts, new List<String>{currentFieldName});
            
            if (!updatedValues.isEmpty())
            {
                updatedFieldToNewValues.put(currentFieldName, updatedValues);
            }
        }
        
        return updatedFieldToNewValues;
    }
}
