import { LightningElement, track, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import CATEGORY_OBJECT from '@salesforce/schema/Category__c';

export default class ProductListSection extends LightningElement {
    @track showFiltersMode = false;

    @track categories = [];

    @wire (getListUi, {objectApiName: CATEGORY_OBJECT, listViewApiName: "Top_Level"})
    retrievedTopCategories ({data, error}) {
        if (data) {
            console.log(data.records.records);
            this.categories.push(data.records.records);
        }
    }

    connectedCallback() {

    }

    get topCategories() {
        console.log(this.retrievedTopCategories);
        return this.retrievedTopCategories.data.records.records;
    }

    filtersMode() {
        this.showFiltersMode = !this.showFiltersMode;
        console.log(this.topCategories);
    }

    showSpinner () {
        this.dispatchEvent(new CustomEvent('showspinner'));
    }

    hideSpinner() {
        this.dispatchEvent(new CustomEvent('hidespinner'));
    }
}