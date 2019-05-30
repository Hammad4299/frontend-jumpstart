abstract class BaseModalHandler{
    container:any;
    editableData:any;
    name:string;
    constructor(container:any) {
        this.container = container;
        this.editableData = null;
        this.name = "BaseModelHandler";
    }

    initViewData(data:any|null|undefined,extraData?:any, callback?:any):void{
        const self = this;
        const form = self.container.find('form');
        this.setEditableData(data);
        if (callback)
            callback();
    }

    protected setEditableData (data:any) {
        this.editableData = data;
    }

    public hookEvents () {
        const self = this;

        self.container.on('click', '.js-submit-form', function () {
            self.submit (self.container.find('form'));
        });
    }
    abstract fillViewFromData(extraData?:any):any;

    public show(data:any,extraData:any = null){
        this.initViewData(data,extraData, ()=>{
           this.fillViewFromData(extraData);
           this.container.modal('show');
        });
    }

    public hide(){
        this.container.modal('hide');
    }

    protected submit(form:any) {
        form.trigger('submit');
    }
}

export default BaseModalHandler;