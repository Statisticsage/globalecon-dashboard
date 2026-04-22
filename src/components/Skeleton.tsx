export function SkeletonKpi() {
  return <div className="dash-card p-5"><div className="skeleton h-2 w-16 mb-3"/><div className="skeleton h-9 w-24 mb-2"/><div className="skeleton h-2 w-28"/></div>;
}
export function SkeletonChart({height=220}:{height?:number}) {
  return <div className="dash-card p-6"><div className="skeleton h-4 w-36 mb-2"/><div className="skeleton h-2.5 w-52 mb-5"/><div className="skeleton rounded-xl" style={{height}}/></div>;
}
