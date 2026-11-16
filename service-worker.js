"use strict";

/*
 * Bei jeder veröffentlichten Änderung erhöhen:
 *
 * v1 → v2 → v3
 */
const CACHE_NAME =
  "ankerketten-rechner-v3";

const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg"
];

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

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(names => {
        return Promise.all(
          names
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

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  /*
   * HTML-Navigation: möglichst aktuelle Netzversion,
   * offline die gespeicherte App.
   */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {
              cache.put(
                "./index.html",
                copy
              );
            });

          return response;
        })
        .catch(async () => {
          return (
            await caches.match("./index.html")
          ) || (
            await caches.match("./")
          );
        })
    );

    return;
  }

  /*
   * App-Dateien: Cache zuerst.
   */
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

            const copy =
              networkResponse.clone();

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
