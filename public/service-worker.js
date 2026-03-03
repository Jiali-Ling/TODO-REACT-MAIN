const CACHE_NAME = "todomagic-v2";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/vite.svg",
  "/assets/index-Bo1EWIHC.js",
  "/assets/index-bEUtZErQ.css",
  "/icons/iconDWT-192.png",
  "/icons/iconDWT-512.png",
];

self.addEventListener("install", (event) => {
  console.log("Service worker installing...");
  // 离线缓存逻辑可以在这里添加
});


self.addEventListener("fetch", (event) => {
  const req = event.request;

  // 只处理 GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 只处理同源
  if (url.origin !== self.location.origin) return;

  // 1) 页面导航：离线返回 index.html（或 "/" 也行，但更推荐 index.html）
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((cached) => {
        return cached || fetch(req);
      }).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // 2) 静态资源：cache-first，miss 再走网络；网络成功再写 cache
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return resp;
      }).catch(() => {
        // 这里是兜底：离线且没缓存到 -> 返回一个明确的失败（而不是抛异常）
        return new Response("", { status: 504, statusText: "Offline and not cached" });
      });
    })
  );
});
