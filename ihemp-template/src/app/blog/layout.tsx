export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen -mx-4 px-4 -mt-4 pt-4">
      {children}
    </div>
  );
}
