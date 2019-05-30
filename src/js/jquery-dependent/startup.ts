import './FormHelpers/Helpers';
import $ from 'jquery'

$(document).ready(function() {
    $(document).on('click','[data-click]',function () {
        let parent = $(document);
        if($(this).attr('data-parent')){
            parent = $($(this).parents($(this).attr('data-parent'))[0])
        }
        const target = parent.find($(this).attr('data-click'));
        target.data('event-initiater',$(this));
        target.trigger('click');
    });

    $(document).on('click','.js-noprop',function (e:any) {
        e.stopPropagation();
    });

    $(document).on('click','[data-href]',function () {
        window.location.href = $(this).attr('data-href');
    });
});