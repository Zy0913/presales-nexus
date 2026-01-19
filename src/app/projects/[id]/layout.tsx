// Generate static params for build
export function generateStaticParams() {
  // For static export, we generate a few sample project IDs
  // In production, this would fetch from your data source
  return [
    { id: 'proj_001' },
    { id: 'proj_002' },
    { id: 'proj_003' },
  ];
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
