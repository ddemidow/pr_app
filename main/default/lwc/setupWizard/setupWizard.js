import {LightningElement, track, wire, api} from 'lwc';
import invokeAction from '@salesforce/apex/ActionControllerTemplate.invokeAction';

export default class SetupWizard extends LightningElement {
    @track username;
    @track password;
    @track userRole

    handleUsernameChange(event) {
        this.username = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleLogin() {
        var action = [{
            className : 'LoginController',
            action : 'user-login',
            args : { username: this.username, password: this.password }
        }];

        var strAction = JSON.stringify(action);

        invokeAction({
            actions : strAction
        }).then(result => {
            console.log('Your role: ' + result);
            this.userRole = result;
        }).catch(error => {
           console.log('err' + JSON.stringify(error));
        });
    }


}