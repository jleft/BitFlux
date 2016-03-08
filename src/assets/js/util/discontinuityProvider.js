import fc from 'd3fc';
import skipWeekends from '../scale/discontinuity/skipWeekends';

export default function(productSource, discontinuousSources) {
    var skip = false;

    if (!Array.isArray(discontinuousSources)) {
        discontinuousSources = [discontinuousSources];
    }

    discontinuousSources.forEach(function(discontinuousSource) {
        if (productSource === discontinuousSource) {
            skip = true;
        }
    });

    return skip ? skipWeekends() : fc.scale.discontinuity.identity();
}
