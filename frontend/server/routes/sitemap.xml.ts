export default defineEventHandler(async (event) => {
  const response = await fetch('https://canarias-on-fire-zojd.onrender.com/api/events/sitemap.xml');

  // Si el backend falla
  if (!response.ok) {
    setResponseStatus(event, response.status);
    return 'Error fetching sitemap';
  }

  const xml = await response.text();
  setResponseHeader(event, 'Content-Type', 'application/xml');
  return xml;
});