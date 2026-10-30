export type ReportPackage = {
    ecosystem: 'npm';
    name: string;
    version: string;
};
export type Manifest = {
    manifestVersion: 1;
    platform: {
        name: 'payload';
        version: string;
    };
    packages: ReportPackage[];
};
export type ManifestInput = {
    manifestVersion: number;
    platform: {
        name: string;
        version: string;
    };
    packages: {
        ecosystem: string;
        name: string;
        version: string;
    }[];
};
export type Report = {
    contractVersion: 1;
    generatedAt: string;
    reporter: {
        name: string;
        version: string;
    };
    runtime: {
        name: 'node';
        version: string;
    };
    platform: {
        name: 'payload';
        version: string;
    };
    packages: ReportPackage[];
};
