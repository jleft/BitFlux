import d3 from 'd3';
import fc from 'd3fc';

export default function(discontinuityProvider, domain, data, ratio) {
    if (arguments.length < 4) {
        ratio = 1;
    }
    var dataExtent = fc.util.extent()
        .fields('date')(data);

    var domainExtent = fc.util.extent()
        .fields(fc.util.fn.identity)(domain);

    var dataTimeExtent = discontinuityProvider.distance(dataExtent[0], dataExtent[1]);
    var scaledDomainTimeDifference = ratio * discontinuityProvider.distance(domainExtent[0], domainExtent[1]);
    var scaledLiveDataDomain = scaledDomainTimeDifference < dataTimeExtent ?
      [discontinuityProvider.offset(dataExtent[1], -scaledDomainTimeDifference), dataExtent[1]] : dataExtent;
    return scaledLiveDataDomain;
}
