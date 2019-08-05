import {LightningElement, track} from 'lwc';
import invokeCachableAction from '@salesforce/apex/ActionControllerTemplate.invokeCachableAction';

export default class SetupWizard extends LightningElement {
    @track username;
    @track password;

    @track user;
    @track uiMessage;

    @track loading;

    usernameCookieName = 'username';
    passwordCookieName = 'password';

    connectedCallback() {
        this.username = this.getCookie(this.usernameCookieName);
        this.password = this.getCookie(this.passwordCookieName);

        if (this.username && this.password) {
            this.handleLogin();
        }
    }

    handleUsernameChange(event) {
        this.username = event.target.value;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleLogin() {
        this.loading = true;

        var action = [{
            className : 'LoginController',
            action : 'user-login',
            args : { username: this.username, password: this.password }
        }];

        var strAction = JSON.stringify(action);

        invokeCachableAction({
            actions : strAction
        }).then(results => {
            console.log('Your user: ' + JSON.stringify(results[0]));

            if (results[0].Id) {
                document.cookie = this.usernameCookieName + ' = ' + this.username + ';';
                document.cookie = this.passwordCookieName + ' = ' + this.password + ';';
                this.user = results[0];
                this.uiMessage = null;
            } else {
               this.uiMessage = 'Unable to log into system. Please try again.'
            }

            this.loading = false;
        }).catch(error => {
           console.log('err' + JSON.stringify(error));
        });
    }

    handleLogout() {
        this.user = null;
        this.deleteCookie(this.usernameCookieName);
        this.deleteCookie(this.passwordCookieName);
    }

    showSpinner(event) {
        this.loading = true;
        event.stopPropagation();
    }

    hideSpinner(event) {
        this.loading = false;
        event.stopPropagation();
    }

     getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');

        console.log(ca);

        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
}