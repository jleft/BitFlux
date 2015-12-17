import seriesSelector from './seriesSelector';
import indicatorSelector from './indicatorSelector';

export default function() {

    // TODO: Instantiate series/indicator components outside of menu model?
    return {
        seriesSelector: seriesSelector(),
        indicatorSelector: indicatorSelector()
    };
}
