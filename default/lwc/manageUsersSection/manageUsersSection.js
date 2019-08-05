import { LightningElement, wire, track } from 'lwc';
import invokeCachableAction from '@salesforce/apex/ActionControllerTemplate.invokeCachableAction';
import invokeAction from '@salesforce/apex/ActionControllerTemplate.invokeAction';
import { refreshApex } from '@salesforce/apex';

export default class ManageUsersSection extends LightningElement {
    controllerName = 'ManageUsersController';
    wiredAccountsResult;

    @track users;
    @track selectedUserId;

    @track userEditMode = false;
    @track userCreateMode = false;
    @track userDeleteMode = false;

    connectedCallback() {
        console.log("connected");
        this.showSpinner();
    }

    getUsersAction = JSON.stringify(
        [{className: this.controllerName, action: "get-users-list", args: {}}]
    );

    @wire (invokeCachableAction, {actions : '$getUsersAction'})
    getUsersList(result){
        this.wiredAccountsResult = result;

        if (result.data) {
            this.users = result.data[0];
            this.hideSpinner();
        } else {
            console.log('error');
            console.log(JSON.stringify(result.error));
        }
    }

    get modalEnabled() {
        return this.userEditMode || this.userDeleteMode || this.userCreateMode;
    }

    editUser(event) {
        this.userEditMode = true;
        this.selectedUserId = event.target.id.substr(0, 18);
    }

    deleteUser(event) {
        this.userDeleteMode = true;
        this.selectedUserId = event.target.id.substr(0, 18);
    }

    deleteUserRecord() {
        this.showSpinner();

        let deleteUserAction = JSON.stringify(
            [{className: this.controllerName, action: "delete-user", args: {userId: this.selectedUserId}}]
        );

        invokeAction({actions: deleteUserAction}).then(
            () => {
                this.closeModal();

                return refreshApex(this.wiredAccountsResult);
             }
        ).then(
            () => {
                this.hideSpinner();
             }
        ).catch(error => {
            console.log('err' + JSON.stringify(error));
        });
    }

    handleUserUpdated() {
        refreshApex(this.wiredAccountsResult).then(() => {
            this.closeModal();
        });
    }

    createUser() {
        this.userCreateMode = true;
    }

    handleUserCreated(event) {
        this.closeModal();

        refreshApex(this.wiredAccountsResult).then(() => {
            this.hideSpinner();
        })
        .catch(error => {
            console.log(error);
        });
    }

    closeModal() {
        this.userDeleteMode = false;
        this.userEditMode = false;
        this.userCreateMode = false;
        this.selectedUserId = null;
    }

    showSpinner () {
        this.dispatchEvent(new CustomEvent('showspinner'));
    }

    hideSpinner() {
        this.dispatchEvent(new CustomEvent('hidespinner'));
    }
}