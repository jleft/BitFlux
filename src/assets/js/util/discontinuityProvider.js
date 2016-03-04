import fc from 'd3fc';

export default function(productSource, discontinuousSources) {
    var skipWeekends = false;

    if (!Array.isArray(discontinuousSources)) {
        discontinuousSources = [discontinuousSources];
    }

    discontinuousSources.forEach(function(discontinuousSource) {
        if (productSource === discontinuousSource) {
            skipWeekends = true;
        }
    });

    return skipWeekends ? fc.scale.discontinuity.skipWeekends() : fc.scale.discontinuity.identity();
}
