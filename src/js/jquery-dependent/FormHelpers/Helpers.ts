import $ from 'jquery';
import {submitForm} from "./Utils";


$(document).ready(function () {
     $(document).on('submit', '.js-ajax-form', function (e:any) {
         e.preventDefault();
         let form = <JQuery<any>>$(this);
         submitForm(form);
         return false;
     })
});