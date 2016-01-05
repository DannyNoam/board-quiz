function BucketLoader (callback, errorCallback, context) {

    (function () {
        new JsonLoader("resource/default/bucket_sizes.json", calculateBestBucket);
    })();

    function calculateScale () {
        return Math.min(Math.floor(window.devicePixelRatio), 2);
    }

    function calculateBestBucket (bucketData) {
        var orientation = calculateOrientation();
        bucketData[orientation].forEach(function (bucket) {
            if (bucket.height <= window.innerHeight) {
                Display.bucket = bucket;
            }
        });

        Display.scale = calculateScale(window.devicePixelRatio);
        Display.resourcePath = Display.bucket.width + 'x' + Display.bucket.height;
        console.log("Display in calculateBestBucket");
        console.log(Display);
        executeCallback();
    }
    
    function calculateOrientation () {
        if (window.innerHeight > window.innerWidth) {
            return "portrait";
        } else {
            return "landscape";
        }
    }

    function executeCallback () {
        if (Display.bucket === null) {
            errorCallback();
        } else {
            callback();
        }
    }
};