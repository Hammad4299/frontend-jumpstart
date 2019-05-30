//Requirement. Creation model and override open modal. addViewForData, removeViewForData.   'js-crudable-item' class. Add event for form submition of modal
import $ from 'jquery';
import {serverApi, ServerApiResponse} from "services/RemoteService";
import { getServerResponse, processResponse, updateFieldState } from "jquery-dependent/FormHelpers/Utils";
import {extractResponseErrors} from "helpers";


abstract class CrudHelper{
    public data:any;
    protected containers:any;
    protected helperData:any;

    constructor(containers:object){
        this.data = {};
        this.containers = containers;

        this.helperData = {
            listingElem: null,
            editClass: null,
            listClass: null,
            deleteClass: null,
            deletionUrl: null,
            creationClass: null
        };
    }
    public init():void{
        this.helperData.listingElem = this.containers.listing.find(this.helperData.listClass);
    }
    protected refreshData(callback?:any){}
    //Calls addData
    public setData(data:any):void{
        const self = this;
        self.data = {};
        self.clearListingView();
        data.map((item:any) => {
            this.addData(item);
        })
    }
    //Calls addViewFofData
    public addData (data:any) {
        const self = this;
        self.addReplaceViewForData(data);
        self.data[data[this.getIdPropertyName()]] = data;
    }
    public getIdPropertyName():string{
        return 'id';
    }
    //Calls removeViewForData
    public removeData (data:any):void {
        const self = this;
        self.removeViewForData(data);
        delete self.data[data.id];
    }
    public clearListingView ():void {
        this.helperData.listingElem.html('');
    }
    protected addReplaceViewForData (data:any):void {
        const view = this.getViewToAddReplace(data);
        const existing = this.helperData.listingElem.find(`.js-crudable-item[data-id='${data[this.getIdPropertyName()]}']`);
        if (existing.length > 0) {
            existing.replaceWith(view);
        } else {
            this.helperData.listingElem.append(view);
        }
    }
    abstract getViewToAddReplace(data:any):any;
    protected removeViewForData (data:any):void {
        this.containers.listing.find(`[data-id='${data[this.getIdPropertyName()]}']`).remove();
    }
    protected abstract viewForCreateEdit (data?:any):void;
    public getDataByID (id:any):any {
        return this.data[id];
    }
    protected getDeletionUrl (id:any):string {
        return this.helperData.deletionUrl;
    }
    protected getSelectedID (clickedElem:any):string {
        return clickedElem.parents('.js-crudable-item').attr('data-id');
    }
    protected handleDeletion (clickedElement:any):void {
        const self = this;
        const containment = clickedElement.parents('.js-crudable-item');
        const id = self.getSelectedID(clickedElement);
        const initiatedData = this.getDataByID(id);

        const res = confirm('Are you sure you want to delete this?');
        if (res) {
            serverApi.request<ServerApiResponse<any>>({url:self.getDeletionUrl(id)})
                .then(resp=> {
                    const r = processResponse(getServerResponse(resp.data));
                    if(r.status)
                        self.removeData(initiatedData);
                    return r;
                })
                .then(resp=>updateFieldState(extractResponseErrors(resp),containment));
        }
    }
    public hookEvents():void{
        const self = this;
        if (this.containers.edit) {
            this.containers.edit.on('click', self.helperData.editClass, function (e:any) {
                const id = self.getSelectedID($(this));
                const d = self.getDataByID(id);
                self.viewForCreateEdit(d);
            });
        }

        if (this.containers.deletion) {
            this.containers.deletion.on('click', self.helperData.deleteClass, function (e:any) {
                self.handleDeletion($(this));
            })
        }

        if (this.containers.create) {
            this.containers.create.on('click', self.helperData.creationClass, function () {
                self.viewForCreateEdit();
            })
        }
    }
}

export default CrudHelper;