import { LightningElement, wire, track } from 'lwc';
import invokeCachableAction from '@salesforce/apex/ActionControllerTemplate.invokeCachableAction';
import invokeAction from '@salesforce/apex/ActionControllerTemplate.invokeAction';
import { refreshApex } from '@salesforce/apex';

export default class ManageUsersSection extends LightningElement {
    controllerName = 'ManageUsersController';

    @track users;
    @track selectedUserId;

    @track userEditMode = false;
    @track userCreateMode = false;
    @track userDeleteMode = false;

    wiredAccountsResult;

    getUsersAction = JSON.stringify(
        [{className: this.controllerName, action: "get-users-list", args: {}}]
    );

    @wire (invokeCachableAction, {actions : '$getUsersAction'})
    getUsersList(result){
        this.wiredAccountsResult = result;

        if (result.data) {
            console.log(result.data[0]);
            this.users = result.data[0];
            this.hideSpinner();
        } else {
            console.log('error');
            console.log(JSON.stringify(result.error));
        }
    }

    /*getUsersAction = JSON.stringify(
        [{className: '$controllerName', action: "get-users-list", args: {}}]
    );


    @wire (invokeCachableAction, {actions : '$getUsersAction'})
    getUsersList(result){
        console.log(this.getUsersAction);
        console.log(result);
        this.wiredAccountsResult = result;

        if (result.data[0]) {
            this.wiredAccountsResult = result;

            console.log('test0 ' + this.wiredAccountsResult);

            console.log(result.data[0]);
            this.users = result.data[0];
            //this.hideSpinner();
        } else {
            console.log('error');
            console.log(JSON.stringify(result.error));
        }
    }*/

    connectedCallback() {
        console.log("connected");
        this.showSpinner();
    }

    get modalEnabled() {
        return this.userEditMode || this.userDeleteMode || this.userCreateMode;
    }

    editUser(event) {
        console.log(event.target);
        this.userEditMode = true;
        this.selectedUserId = event.target.id.substr(0, 18);
    }

    deleteUser(event) {
        console.log(event.target);
        this.userDeleteMode = true;
        this.selectedUserId = event.target.id.substr(0, 18);
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

        //this.users = this.getUsersList.data[0];
    }

    closeModal() {
        this.userDeleteMode = false;
        this.userEditMode = false;
        this.userCreateMode = false;
        this.selectedUserId = null;
    }

    deleteUserRecord() {
        this.showSpinner();

        let deleteUserAction = JSON.stringify(
            [{className: this.controllerName, action: "delete-user", args: {userId: this.selectedUserId}}]
        );

        invokeAction({actions: deleteUserAction}).then(
            () => {
                console.log('user deleted!');
                this.closeModal();

                console.log('test ' + this.wiredAccountsResult);

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

    showSpinner () {
        this.dispatchEvent(new CustomEvent('showspinner'));
    }

    hideSpinner() {
        this.dispatchEvent(new CustomEvent('hidespinner'));
    }
}