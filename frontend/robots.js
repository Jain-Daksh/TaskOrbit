// app/robots.js

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://task-orbit-nu.vercel.app/sitemap.xml',
  };
}
