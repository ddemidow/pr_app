import { LightningElement, wire, track, api } from 'lwc';
import invokeCachableAction from '@salesforce/apex/ActionControllerTemplate.invokeCachableAction';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import USER_OBJECT from '@salesforce/schema/User__c';
import NAME_FIELD from '@salesforce/schema/User__c.Name';
import USERNAME_FIELD from '@salesforce/schema/User__c.Username__c';
import PASSWORD_FIELD from '@salesforce/schema/User__c.Password__c';
import ROLE_FIELD from '@salesforce/schema/User__c.User_Role__c';
import COMPANY_FIELD from '@salesforce/schema/User__c.Main_Company__c';

export default class HomeSection extends LightningElement {
    @api userId;
    @api companyId;

    @track creationCompany;

    userObject = USER_OBJECT;
    nameField = NAME_FIELD;
    usernameField = USERNAME_FIELD;
    roleField = ROLE_FIELD;
    companyField = COMPANY_FIELD;
    passwordField = PASSWORD_FIELD;

    @track userCompanyId;

    @track changePasswordMode;
    @track oldPassword;
    @track passwordValid = false;
    @track message;

    enableCompanyCreation(){
        this.creationCompany = true;
    }

    replaceChangePasswordMode(){
        this.changePasswordMode = !this.changePasswordMode;
    }

    isPasswordValid() {
        var action = [{
            className : 'HomePageController',
            action : 'check-password',
            args : { userId: this.userId, password: this.oldPassword }
        }];

        var strAction = JSON.stringify(action);

        invokeCachableAction({actions: strAction}).then(
            results => {
                console.log('test - ' + results[0]);

                if (results[0]) {
                    this.passwordValid = results[0];
                } else {
                    console.log('invalid');
                    this.message = 'Password incorrect.';
                }
            }).catch(error => {
                console.log('err' + JSON.stringify(error));
        });
    }

    handleUserUpdated () {
        this.changePasswordMode = false;
        this.oldPassword = null;
        this.passwordValid = false;
        this.message = null;

        this.hideSpinner();
    }

    handleOldPasswordChange (event) {
        this.oldPassword = event.target.value;
    }

    handleSuccess(event) {
        this.companyId = event.detail.id;
        this.userCompanyId = this.companyId;
        this.creationCompany = false;

        this.hideSpinner();
    }

    showNotification(title, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: '',
            variant: variant,
        });

        this.dispatchEvent(evt);
    }

    showSpinner () {
        this.dispatchEvent(new CustomEvent('showspinner'));
    }

    hideSpinner() {
        this.dispatchEvent(new CustomEvent('hidespinner'));
    }

}