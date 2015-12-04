export default function(yExtent, paddingPercentage) {
    var paddingArray = Array.isArray(paddingPercentage) ?
      paddingPercentage : [paddingPercentage, paddingPercentage];
    var orderedYExtentDifference = yExtent[1] - yExtent[0];

    return [yExtent[0] - orderedYExtentDifference * paddingArray[0],
        yExtent[1] + orderedYExtentDifference * paddingArray[1]];
}
