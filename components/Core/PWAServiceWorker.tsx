"use client";

import { useEffect } from "react";

export function PWAServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Hydra SW registered: ", registration.scope);
        })
        .catch((err) => {
          console.log("Hydra SW registration failed: ", err);
        });
    }
  }, []);

  return null;
}
