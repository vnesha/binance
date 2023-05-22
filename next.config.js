/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

module.exports = {
    env: {
        NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
        NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
        NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_TEST_API_KEY: process.env.NEXT_PUBLIC_TEST_API_KEY,
        NEXT_PUBLIC_TEST_SECRET_KEY: process.env.NEXT_PUBLIC_TEST_SECRET_KEY,
        NEXT_PUBLIC_TEST_API_URL: process.env.NEXT_PUBLIC_TEST_API_URL,
    },
};