import { LightningElement, wire, track } from 'lwc';
import invokeAction from '@salesforce/apex/ActionControllerTemplate.invokeAction';

export default class HomeSection extends LightningElement {
    @track personalInfoEditMode;
    @track companyInformationEditMode;


}