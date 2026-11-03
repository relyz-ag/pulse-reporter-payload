import {
  assertManifest,
  buildReport,
  handleReportRequest
} from "./chunk-7ITONS3K.js";

// src/version.ts
var REPORTER_NAME = "reporter-payload";
var REPORTER_VERSION = "1.0.3";

// src/index.ts
var reporter = { name: REPORTER_NAME, version: REPORTER_VERSION };
var pulseReporter = (options) => (config) => {
  const manifest = assertManifest(options.manifest, "payload");
  const endpoint = {
    path: options.path ?? "/pulse/report",
    method: "get",
    handler: (req) => handleReportRequest({
      authorization: req.headers.get("authorization"),
      token: options.token ?? process.env.PULSE_TOKEN,
      manifest,
      reporter
    })
  };
  return { ...config, endpoints: [...config.endpoints ?? [], endpoint] };
};
var buildReport2 = (manifest, now) => buildReport(manifest, reporter, now);
export {
  buildReport2 as buildReport,
  pulseReporter
};
