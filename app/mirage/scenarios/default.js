export default function(server) {
  server.loadFixtures('routes');
  server.loadFixtures('daily-riderships');
  server.loadFixtures('system-trends');
}
