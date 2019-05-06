import { LightningElement, track, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import invokeCachableAction from '@salesforce/apex/ActionControllerTemplate.invokeCachableAction'
import invokeAction from '@salesforce/apex/ActionControllerTemplate.invokeAction';
import CATEGORY_OBJECT from '@salesforce/schema/Category__c';
import PRODUCT_CONFIGURATION_OBJECT from '@salesforce/schema/Product_Configuration__c';

export default class ProductListSection extends LightningElement {
    controllerName = "ProductListController";
    selectedCategoryIds = new Set();

    categoriesStore = new Map();
    
    @track showFiltersMode = false;
    @track categoriesToShow = [];
    @track configsToShow = [];

    @wire (getListUi, {objectApiName: CATEGORY_OBJECT, listViewApiName: "Top_Level"})
    retrievedTopCategories ({data, error}) {
        if (data) {
            //console.log(data.records.records);

            let tests = [];

            data.records.records.forEach((currentCategory, index)=>{
                //console.log(currentCategory);
                let test = this.configurateCategoryWrapper(currentCategory.fields.Id.value, currentCategory.fields.Name.value, 0, false);
                //console.log("test " + test );

                tests.push(test);
            });

            this.categoriesToShow.push({index: this.categoriesToShow.length, data: tests});

            this.hideSpinner();
        }
    }

    @wire (getListUi, {objectApiName: PRODUCT_CONFIGURATION_OBJECT, listViewApiName: "All_Records"})
    retrievedProductConfigs ({data, error}) {
        if (data) {
            console.log("configs");
            console.log(data);
            console.log(data.records.records);
            data.records.records.forEach((currentConfig, index)=>{
                console.log(currentConfig.fields.Id.value);

                this.configsToShow.push(this.configurateConfigWrapper(index, currentConfig.fields.Name.value,
                currentConfig.fields.Type__c.value));
            });
        } else {
            //handle error
        }
    }

    connectedCallback() {
        this.showSpinner();
    }

    filtersMode() {
        this.showFiltersMode = !this.showFiltersMode;
        //console.log(this.topCategories);
    }

    handleCategoryClick(event) {
        console.log(event.target);
        //console.log(event.target.children[1].id);
        var element = event.target;

        let level = element.name;
        let id = element.id.substr(0, 18);
        let value = element.checked;

        console.log("level - " + level);
        console.log("id - " + id);
        console.log("value - " + value);

        if (element.type === 'checkbox-button') {
            if (value) {
                this.selectedCategoryIds.add(id);
            } else {
                this.selectedCategoryIds.delete(id);
            }
        }

        this.categoriesToShow[level].data.forEach((currentCategory, index) =>{
            if (currentCategory.id === id) {
                currentCategory.iconName = "utility:chevronright";
            } else {
            currentCategory.iconName = "utility:down";
            }
        });

        console.log("selcted ids");
        console.log(this.selectedCategoryIds);

        this.categoriesToShow.splice(level+1, this.categoriesToShow.length-1);


        let categoriesRequestAction = JSON.stringify(
            [{className: this.controllerName, action: "get-child-categories", args: {categoryId: id}}]
        );

        invokeCachableAction({actions: categoriesRequestAction}).then(
            (childCategories) => {
                let categoriesWrappers = [];

                childCategories[0].forEach((currentCategory, index)=>{
                    let categoryWrapper = this.configurateCategoryWrapper(currentCategory.Id, currentCategory.Name,
                        level+1, this.selectedCategoryIds.has(currentCategory.Id));

                    categoriesWrappers.push(categoryWrapper);
                });

                if (childCategories) {
                    if (childCategories.length != 0) {
                        this.categoriesToShow.push({index: this.categoriesToShow.length, data: categoriesWrappers});
                    }
                }
            }
        ).catch(error => {
            console.log(JSON.stringify(error));
        });
    }

    handleFilterChange(event) {
        console.log(event.target);
    }

    test() {
        console.log("test");
    }

    configurateCategoryWrapper(categoryId, categoryName, level, value) {
        return {level: level, name: categoryName, id: categoryId, value: value, iconName: "utility:down"};
    }

    configurateConfigWrapper(index, configName, configType, defaultValue) {
        let inputType;
        let isSelect;

        switch(configType) {
            case "Number":
                inputType = "number";
                isSelect = false;
                break;
            case "Text":
                inputType = "text";
                isSelect = false;
                break;
            case "Drop sown":
                inputType = "select"
                isSelect = true;
                break;
            default:
                inputType = "text";
        }

        console.log(inputType);
        console.log(isSelect);

        return {index: index, name: configName, type: configType, isSelect: isSelect};
    }

    showSpinner () {
        this.dispatchEvent(new CustomEvent('showspinner'));
    }

    hideSpinner() {
        this.dispatchEvent(new CustomEvent('hidespinner'));
    }
}