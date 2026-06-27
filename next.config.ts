import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'lastfm.freetls.fastly.net' },
            { protocol: 'https', hostname: '**.akamaized.net' },
            { protocol: 'https', hostname: '**.dzcdn.net' },
            { protocol: 'https', hostname: '**.mzstatic.com' },
        ],
    },
};

export default withNextIntl(nextConfig);
