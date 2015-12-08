import indicatorOptions from './indicatorOptions';
import secondaryChartOptions from './secondaryChartOptions';

export default function() {
    return {
        config: {
            title: 'Add Indicator',
            careted: false,
            listIcons: true,
            icon: false
        },
        indicatorOptions: indicatorOptions,
        secondaryChartOptions: secondaryChartOptions
    };
}
