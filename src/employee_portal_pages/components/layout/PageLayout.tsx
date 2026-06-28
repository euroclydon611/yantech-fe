interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function PageLayout({
  children,
  title,
  description,
}: PageLayoutProps) {
  return (
    <>
      <div className="p-2">
        <h1 className="text-xl font-mono font-bold text-gray-900">{title}</h1>
        {description && <p className="text-xs text-gray-500 !font-mono">{description}</p>}
      </div>
      {children}
    </>
  );
}
