# test-sending-telemetry-new-relic
Test sending telemetry data to New Relic
This repo provides test Lambda function code to test out connection to New Relic collctor

- For US endpoint add env var `NEW_RELIC_TELEMETRY_ENDPOINT` = `cloud-collector.newrelic.com`

- For EU endpoint add env var `NEW_RELIC_TELEMETRY_ENDPOINT` = `cloud-collector.eu01.nr-data.net`

- NEW_RELIC_LICENSE_KEY = `Specifies your New Relic ingest key`

Following is a sample successful response from New Relic collector:
```
{
  "statusCode": 202,
  "body": "{\"requestId\":\"2ab5dffe-1234-1234-1234-01971365d429\"}"
}
```

Following response indicates that either the New Relic Collector endpoint or New Relic Ingest license key is incorrect
```
{
  "statusCode": 403,
  "body": "{}"
}
```
