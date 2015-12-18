export default function(event) {
    if (event.wasClean === false && event.code !== 1000 && event.code !== 1006) {
        var reason = event.reason || 'Unkown reason.';
        return 'Disconnected from live stream: ' + event.code + ' ' + reason;
    }
}
