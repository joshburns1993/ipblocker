// Example (using the function below).

var ipTester = [];

getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
   ipTester = (ips.join('\n '));
   console.log(ipTester);

// Tests local IP against specified (Allowed) IP

   if(ipTester.includes("insertIPHere") ){console.log(true)}

// If does not pass, blocks access to certain restricted websites

   else{
     console.log("false");
     chrome.webRequest.onBeforeRequest.addListener(
             function(details) { return {cancel: true}; },
             {urls: ["*://www.facebook.com/*"]},
             ["blocking"]);

   };
});




// from https://stackoverflow.com/questions/18572365/get-local-ip-of-a-device-in-chrome-extension -- Thanks!

function getLocalIPs(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        // Don't specify any stun/turn servers, otherwise you will
        // also find your public IP addresses.
        iceServers: []
    });
    // Add a media line, this is needed to activate candidate gathering.
    pc.createDataChannel('');

    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function(e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {});
}
