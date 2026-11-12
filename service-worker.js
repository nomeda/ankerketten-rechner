"use strict";

/*
 * Bei jeder neuen veröffentlichten Version erhöhen:
 *
 * v1 -> v2 -> v3
 */
const CACHE_NAME = "ankerketten-rechner-v1";

/*
 * Dateien, die für den Offlinebetrieb gespeichert werden.
 */
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg"
];

/*
 * App-Dateien bei der Installation herunterladen.
 */
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(APP_FILES);
      })
  );

  self.skipWaiting();
});

/*
 * Alte Cache-Versionen löschen.
 */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => {
              return name !== CACHE_NAME;
            })
            .map(name => {
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

/*
 * Seitenaufrufe:
 * Zuerst das Netz versuchen, bei fehlender Verbindung
 * die gespeicherte App laden.
 *
 * Andere Dateien:
 * Zuerst den Cache prüfen.
 */
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  /*
   * Nur Dateien der eigenen GitHub-Pages-Seite bearbeiten.
   */
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          const copy = networkResponse.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {
              cache.put(
                "./index.html",
                copy
              );
            });

          return networkResponse;
        })
        .catch(async () => {
          const cachedIndex =
            await caches.match("./index.html");

          if (cachedIndex) {
            return cachedIndex;
          }

          return caches.match("./");
        })
    );

    return;
  }

  event.respondWith(
    caches
      .match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(networkResponse => {
            if (
              !networkResponse ||
              networkResponse.status !== 200
            ) {
              return networkResponse;
            }

            const copy = networkResponse.clone();

            caches
              .open(CACHE_NAME)
              .then(cache => {
                cache.put(request, copy);
              });

            return networkResponse;
          });
      })
  );
});