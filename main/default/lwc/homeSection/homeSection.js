import { LightningElement, wire, track, api } from 'lwc';
import invokeAction from '@salesforce/apex/ActionControllerTemplate.invokeAction';
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

    @track loading = false;

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

        invokeAction({actions: strAction}).then(
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


        this.loading = false;
        //this.showNotification('User Saved!', 'success');
    }

    handleOldPasswordChange (event) {
        this.oldPassword = event.target.value;
    }

    testFunction() {
        console.log(this.template.getElementById('test'));
    }

    handleSuccess(event) {
        this.companyId = event.detail.id;
        this.userCompanyId = this.companyId;
        this.creationCompany = false;

        //this.showNotification('Company Saved!', 'success');

        this.loading = false;
    }

    showNotification(title, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: '',
            variant: variant,
        });

        this.dispatchEvent(evt);
    }

    spinner () {
        this.loading = true;
    }

}