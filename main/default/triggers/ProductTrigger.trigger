trigger ProductTrigger on Product2 (after insert, after update) {
    TriggerTemplate.TriggerManager triggerManager = new TriggerTemplate.TriggerManager();
    triggerManager.addHandler(new ProductHandler(), new List<TriggerTemplate.TriggerAction>{
            TriggerTemplate.TriggerAction.afterinsert, TriggerTemplate.TriggerAction.afterupdate
    });

    triggerManager.runHandlers();
}