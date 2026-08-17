export default async function sitemap() {
  return [
    {
      url: 'https://task-orbit-nu.vercel.app/',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
