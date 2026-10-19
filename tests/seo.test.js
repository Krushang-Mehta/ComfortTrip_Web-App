import test from 'node:test';
import assert from 'node:assert/strict';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';

test('Sitemap: Generates valid XML sitemap entries for public routes', () => {
  const routes = sitemap();
  assert.ok(Array.isArray(routes), 'Sitemap must return an array');
  assert.ok(routes.length >= 5, 'Sitemap should contain all primary public pages');

  const urls = routes.map((r) => r.url);
  assert.ok(urls.some((u) => u.endsWith('/') || !u.split('//')[1].includes('/')), 'Must include root');
  assert.ok(urls.some((u) => u.includes('/Bookings')), 'Must include /Bookings');
  assert.ok(urls.some((u) => u.includes('/Cars')), 'Must include /Cars');
  assert.ok(urls.some((u) => u.includes('/Services')), 'Must include /Services');
  assert.ok(urls.some((u) => u.includes('/about-us')), 'Must include /about-us');

  // Assert priorities and change frequencies
  routes.forEach((route) => {
    assert.ok(route.url, 'Route must have url');
    assert.ok(route.lastModified, 'Route must have lastModified');
    assert.ok(route.changeFrequency, 'Route must have changeFrequency');
    assert.ok(typeof route.priority === 'number', 'Route must have priority number');
  });
});

test('Robots: Configures crawling directives and references sitemap', () => {
  const robotConfig = robots();
  assert.ok(robotConfig.rules, 'Robots must have rules');
  assert.ok(robotConfig.sitemap, 'Robots must specify sitemap url');
  assert.match(robotConfig.sitemap, /sitemap\.xml$/);

  const mainRule = robotConfig.rules[0];
  assert.equal(mainRule.userAgent, '*');
  assert.equal(mainRule.allow, '/');
  assert.ok(mainRule.disallow.includes('/admin/'), 'Must disallow admin area');
  assert.ok(mainRule.disallow.includes('/api/'), 'Must disallow private api routes');
});
