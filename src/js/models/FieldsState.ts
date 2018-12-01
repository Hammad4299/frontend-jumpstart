import { ErrorInfo } from "models";

export class FieldsState {
    protected errors:{[field:string]:ErrorInfo};

    constructor(fields:string[]=[]){
        this.errors = {};
        fields.forEach(field=>this.initForField(field));
    }

    public getErrors(){
        return this.errors;
    }

    public getError(field:string) {
        this.initForField(field);
        return this.errors[field];
    }

    protected initForField(field:string){
        if(!this.errors[field]) {
            this.errors[field] = {
                error: null,
                errors: [],
                hasError: false
            };
        }
    }

    public addError(field:string, error:string) {
        this.initForField(field);
        this.errors[field].error = error;
        this.errors[field].hasError = true;
        this.errors[field].errors.push(error);
    }

    public setErrors(field:string, errors:string[]) {
        this.initForField(field);
        this.errors[field].hasError = errors.length>0;
        this.errors[field].error = errors.length>0 ? errors[0]  : null;
        this.errors[field].errors = errors;
    }
}