s3-logs-lambda-script
===================

A simple Lambda script to process logs from Amazon s3. It gets the latest file added, unzips the file, extract the contents and converts them to an array. 

--


No additional dependencies, you can copy straight into AWS Console. If you are using it make sure to change the data within "structureData()" to reflect your own logs. 