(function(d3, fc, sc) {
    'use strict';

    sc.menu.generator.tabGroup = function() {
        var dispatch = d3.dispatch('tabClick');
        var dataJoin = fc.util.dataJoin()
            .selector('ul')
            .element('ul');

        function tabGroup(selection) {
            var selectedIndex = selection.datum().selectedIndex || 0;

            var ul = dataJoin(selection, [selection.datum().options]);

            ul.enter().append('ul');

            var li = ul.selectAll('li')
                .data(function(d) { return d; });

            li.enter()
                .append('li');

            li.classed('active', function(d, i) { return (i === selectedIndex); })
                .html(function(option) {
                    return '<a href="#">' + option.displayString + '</a>';
                })
                .on('click', dispatch.tabClick);
        }

        d3.rebind(tabGroup, dispatch, 'on');
        return tabGroup;
    };

})(d3, fc, sc);