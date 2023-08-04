const router = require('./Route.jsx').default;
const GenerateSitemap = require('react-router-sitemap-maker').default;

const siteMap = GenerateSitemap(router, {
	baseUrl: 'https://mindustrytool.web.app',
	hashrouting: true,
	changeFrequency: 'weekly',
});

siteMap.toFile('./public/sitemap.xml');
