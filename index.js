const zlib = require('zlib'),
    AWS = require('aws-sdk'),
    elasticURL = '';

AWS.config.update({region: 'eu-west-1'});
const s3 = new AWS.S3();

// Handler for S3 put event (New log file)
exports.handler = function (event, context) {
    var fileKey = event.Records[0].s3.object.key;

    var params = {
        Bucket: 'bucketname',
        Key: 'logs/' + fileKey
    };

    s3.getObject(params, (err, data) => {
        if (!err) {
            // Unzip file
            var unzipFile = zlib.gunzipSync(data.Body);
            var output = unzipFile.toString().split("\n");

            // Return if extraction fails
            if (output.length < 1) return;

            structureData(output);
        }
    });
};

function structureData(output) {
    output.forEach(item => {
        // Return early if doesn't contain tracking url
        if (item.indexOf("set.png") === -1) return;

        // Split each tab (column)
        var columns = item.split("\t");

        // Fields within array (Yours will be different)
        var date = columns[0],
            ipAddress = columns[4],
            currentUrl = columns[9],
            queryString = decodeURI(columns[11]); // Decode to remove spaces etc

        // Correctly encode URL and convert to array
        queryString = queryString.replace(/%5B/g, '[');
        queryString = queryString.replace(/%5D/g, ']');
        queryString = queryString.split("&");

        createDataToUpload(date, ipAddress, currentUrl, queryString);
    });
}



function createDataToUpload(date, ipAddress, currentUrl, queryString) {
    queryString.forEach((data, index, array) => {
        // Process each item
        console.log(data);

        // Call back to post data after forEach loop
        itemsProcessed += 1;
        if (itemsProcessed === array.length) {
            postDataToServer();
        }
    });
}

function postDataToServer() {
    console.log('Post to server....');
    console.log('Items processed: ' + itemsProcessed);

    // Axios.post(elasticURL, {})
}