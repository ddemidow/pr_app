public with sharing class ProductHandler implements TriggerTemplate.Handler
{
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
            ProductService.assignProductOnCategories(newValues);
        }
    }
}
