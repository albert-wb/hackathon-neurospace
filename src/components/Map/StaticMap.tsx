"use client";

import dynamic from "next/dynamic";

const StaticMapClient = dynamic(() => import("./StaticMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface flex items-center justify-center">
      <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface StaticMapProps {
  latitude: number;
  longitude: number;
}

export default function StaticMap(props: StaticMapProps) {
  return <StaticMapClient {...props} />;
}
