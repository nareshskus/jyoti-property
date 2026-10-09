"use client";

import dynamic from "next/dynamic";

const PropertyMapInner = dynamic(
  () => import("@/components/property-map").then((module) => module.PropertyMap),
  {
    ssr: false,
    loading: () => <div className="h-[360px] rounded-[1.5rem] border border-slate-200 bg-slate-100" />,
  },
);

export function PropertyMapWrapper({
  latitude,
  longitude,
  title,
}: {
  latitude?: number;
  longitude?: number;
  title: string;
}) {
  return <PropertyMapInner latitude={latitude} longitude={longitude} title={title} />;
}
