/** @type {import('next').NextConfig} */
const basePath = '/presales-nexus';

const nextConfig = {
  output: 'export',
  basePath: basePath,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

if (process.env.NODE_ENV !== 'production') {
  const deployUrl = `http://192.168.103.152:32080${basePath}/`;
  const localUrl = `http://localhost:3000${basePath}/`;

  console.log(`\n✅ \x1b[32mReady for development!\x1b[0m`);
  console.log(`   \x1b[36mLocal:\x1b[0m   ${localUrl}`);
  console.log(`   \x1b[35mDeploy:\x1b[0m  ${deployUrl} (Target Server)\n`);
}

export default nextConfig;
