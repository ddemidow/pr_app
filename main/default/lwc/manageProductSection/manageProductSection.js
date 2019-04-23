import { LightningElement, track, wire } from 'lwc';
import invokeCachableAction from '@salesforce/apex/ActionControllerTemplate.invokeCachableAction'
import invokeAction from '@salesforce/apex/ActionControllerTemplate.invokeAction';
import { refreshApex } from '@salesforce/apex';

export default class ManageProductSection extends LightningElement {
    controllerName = "ManageProductController";
    wiredCategoriesResult;
    wiredConfigsResult;
    listsLoadedCount = 0;
    getCategoriesAction = JSON.stringify(
        [{className: this.controllerName, action: "get-categories-list", args: {}}]
    );
    getConfigsAction = JSON.stringify(
        [{className: this.controllerName, action: "get-product-configs-list", args: {}}]
    );

    @track modifyMode;
    @track categoryDeleteMode;
    @track configDeleteMode;

    @track currentLDS_Name;
    @track currentLDS_Sobject;
    @track currentLDS_Id;
    @track currentLDS_Fields;

    @track categories;
    @track configs;

    @wire (invokeCachableAction, {actions : '$getCategoriesAction'})
    getCategoriesList(result){
        console.log('inited');

        this.wiredCategoriesResult = result;

        if (result.data) {
            this.categories = result.data[0];
            this.listsLoadedCount++;

            if (this.listsLoadedCount > 1) {
                this.hideSpinner();
            }
        } else {
            console.log('error');
            console.log(JSON.stringify(result.error));
        }
    }

    @wire (invokeCachableAction, {actions : '$getConfigsAction'})
    getConfigsList(result){
        this.wiredConfigsResult = result;

        if (result.data) {
            this.configs = result.data[0];
            this.listsLoadedCount++;

            if (this.listsLoadedCount > 1) {
                this.hideSpinner();
            }
        } else {
            console.log('error');
            console.log(JSON.stringify(result.error));
        }
    }

    connectedCallback() {
        this.showSpinner();
    }

    get modalEnabled() {
        return this.modifyMode || this.categoryDeleteMode || this.configDeleteMode;
    }

    createNewCategoryMode() {
        this.modifyMode = true;
    }

    enableModal(event) {
        console.log(event.target.name);

        switch(event.target.name) {
            case 'newCategory':
                this.currentLDS_Id = null;
                this.currentLDS_Name = "New Category";
                this.currentLDS_Sobject = 'Category__c';
                this.currentLDS_Fields = ['Name', 'Master_Category__c']
                this.modifyMode = true;
                break;
            case 'editCategory':
                this.currentLDS_Name = "Edit Category";
                this.currentLDS_Sobject = 'Category__c';
                this.currentLDS_Id = event.target.id.substring(0, 18);
                this.currentLDS_Fields = ['Name', 'Master_Category__c']
                this.modifyMode = true;
                break;
            case 'deleteCategory':
                this.currentLDS_Name = "Delete Category";
                this.currentLDS_Id = event.target.id.substring(0, 18);
                this.categoryDeleteMode = true;
                break;
            case 'newConfig':
                this.currentLDS_Id = null;
                this.currentLDS_Name = "New Field Configuration";
                this.currentLDS_Sobject = 'Product_Configuration__c';
                this.currentLDS_Fields = ['Name', 'Type__c', 'Api_Name__c', 'Description__c'];
                this.modifyMode = true;
                break;
            case 'editConfig':
                this.currentLDS_Name = "Edit Field Configuration";
                this.currentLDS_Sobject = 'Product_Configuration__c';
                this.currentLDS_Id = event.target.id.substring(0, 18);
                this.currentLDS_Fields = ['Name', 'Type__c', 'Api_Name__c', 'Description__c'];
                this.modifyMode = true;
                break;
            case 'deleteConfig':
                this.currentLDS_Name = "Delete Field Configuration";
                this.currentLDS_Id = event.target.id.substring(0, 18);
                this.configDeleteMode = true;
                break;
            case undefined:
                break;
        }
    }

    refreshLists() {
        this.listsLoadedCount = 0;

        Promise.all([refreshApex(this.wiredConfigsResult), refreshApex(this.wiredCategoriesResult)]).then(
            (() => {
                this.closeModal();
                this.hideSpinner();
            }).bind(this)
        );
    }

    deleteCategory() {
        this.showSpinner();

        let deleteCategoryAction = JSON.stringify(
            [{className: this.controllerName, action: "delete-category", args: {categoryId: this.currentLDS_Id}}]
        );

        invokeAction({actions: deleteCategoryAction}).then(
            () => {
                this.closeModal();

                return refreshApex(this.wiredCategoriesResult);
            }
        ).then(
            () => {
                    this.hideSpinner();
            }
        ).catch(error => {
            console.log('err' + JSON.stringify(error));
        });
    }

    deleteConfig() {
        this.showSpinner();

        let deleteConfigAction = JSON.stringify(
            [{className: this.controllerName, action: "delete-product-config", args: {configId: this.currentLDS_Id}}]
        );

        invokeAction({actions: deleteConfigAction}).then(
        () => {
            this.closeModal();

            return refreshApex(this.wiredConfigsResult);
        }).then(
            () => {
                this.hideSpinner();
            }).catch(error => {
                console.log('err' + JSON.stringify(error));
        });
    }

    closeModal() {
        this.modifyMode = false;
        this.categoryDeleteMode = false;
        this.configDeleteMode = false;
    }

    showSpinner () {
        this.dispatchEvent(new CustomEvent('showspinner'));
    }

    hideSpinner() {
        this.dispatchEvent(new CustomEvent('hidespinner'));
    }

}