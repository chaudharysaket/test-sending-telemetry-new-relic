const https = require('https');
const fs = require('fs');
const zlib = require('zlib');

exports.handler = async (event) => {

    
  const jsonData = {
    testkey1: 'testvalue1',
    testkey2: 'testvalue2',
  };

  const gzipPromise = new Promise((resolve, reject) => {
    zlib.gzip(JSON.stringify(jsonData), (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });

  const gzippedData = await gzipPromise;

  // Refer New Relic docs for telemetry endpoint.
  // For US, newRelicTelemetryEndpoint = cloud-collector.newrelic.com
  // For EU, newRelicTelemetryEndpoint = cloud-collector.eu01.nr-data.net
  // NEW_RELIC_LICENSE_KEY =  New Relic Ingest License Key
  // https://docs.newrelic.com/docs/serverless-function-monitoring/aws-lambda-monitoring/instrument-lambda-function/env-variables-lambda/#Lambda%20extension
  const newRelicTelemetryEndpoint = process.env.NEW_RELIC_TELEMETRY_ENDPOINT || 'cloud-collector.newrelic.com';
  const newRelicLicenseKey = process.env.NEW_RELIC_LICENSE_KEY
  
  const options = {
    hostname: newRelicTelemetryEndpoint,
    path: '/aws/lambda/v1',
    method: 'POST',
    headers: {
      'Content-Encoding': 'gzip',
      'Content-Type': 'application/json',
      'User-Agent': 'newrelic-lambda-extension',
      'X-License-Key': newRelicLicenseKey, 
      'Content-Length': gzippedData.length,
    },
  };

  // Send POST request
  const requestPromise = new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Return the status and response data
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    // Write gzipped data to the request
    req.write(gzippedData);
    req.end();
  });

  const response = await requestPromise;
  return response;
};
