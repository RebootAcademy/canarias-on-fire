export default defineEventHandler(async (event) => {
  const response = await fetch(`${process.env.API_BASE_URL}/events/sitemap.xml`);

  // Si el backend falla
  if (!response.ok) {
    setResponseStatus(event, response.status);
    return 'Error fetching sitemap';
  }

  const xml = await response.text();
  setResponseHeader(event, 'Content-Type', 'application/xml');
  return xml;
});