import { handleReportRequest } from './report.js';
import { assertManifest } from './snapshot.js';
export const pulseReporter = (options) => (config) => {
    const manifest = assertManifest(options.manifest);
    const endpoint = {
        path: options.path ?? '/pulse/report',
        method: 'get',
        handler: (req) => handleReportRequest({
            authorization: req.headers.get('authorization'),
            token: options.token ?? process.env.PULSE_TOKEN,
            manifest,
        }),
    };
    return { ...config, endpoints: [...(config.endpoints ?? []), endpoint] };
};
export { buildReport } from './report.js';
