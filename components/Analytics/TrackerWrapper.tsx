"use client";

import { Suspense } from "react";
import { useDRKCNAYTracker } from "@/lib/analytics/tracker";

function Tracker() {
  useDRKCNAYTracker();
  return null;
}

export function TrackerWrapper() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
