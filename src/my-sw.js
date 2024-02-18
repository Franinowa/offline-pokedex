import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

console.log('service worker registered');

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);