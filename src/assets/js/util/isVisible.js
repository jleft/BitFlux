import $ from 'jquery';

export default function(selection) {
    return $(selection.node()).is(':visible');
}
