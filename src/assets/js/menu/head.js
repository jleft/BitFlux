import d3 from 'd3';
import productAdaptor from '../model/menu/productAdaptor';
import periodAdaptor from '../model/menu/periodAdaptor';
import dropdown from './generator/dropdown';
import tabGroup from './generator/tabGroup';
import event from '../event';

export default function() {

    var dispatch = d3.dispatch(
      event.dataProductChange,
      event.dataPeriodChange);

    var dataProductDropdown = dropdown()
      .on('optionChange', function(product) {
          dispatch[event.dataProductChange](product);
      });

    var dataPeriodSelector = tabGroup()
      .on('tabClick', function(period) {
          dispatch[event.dataPeriodChange](period);
      });

    var head = function(selection) {
        selection.each(function(model) {
            var container = d3.select(this);

            var products = model.products;
            container.select('#product-dropdown')
                .datum({
                    config: model.productConfig,
                    options: products.map(productAdaptor),
                    selectedIndex: products.indexOf(model.selectedProduct)
                })
                .call(dataProductDropdown);
            var periods = model.selectedProduct.periods;
            container.select('#period-selector')
                .classed('hidden', periods.length <= 1) // TODO: get from model instead?
                .datum({
                    options: periods.map(periodAdaptor),
                    selectedIndex: periods.indexOf(model.selectedPeriod)
                })
                .call(dataPeriodSelector);

            selection.select('#toggle-button')
                .on('click', function() {
                    dispatch[event.toggleSlideout]();
                });
        });
    };

    return d3.rebind(head, dispatch, 'on');
}
