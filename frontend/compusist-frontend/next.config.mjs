/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Ignorar o ESLint durante o build
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Ignorar erros de TypeScript durante o build
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;
  