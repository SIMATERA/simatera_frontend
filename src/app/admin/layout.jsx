// app/admin/layout.js
import Sidebar from '@/components/sidebar';

export default function AdminLayout({ children, params }) {
  // Misal role di sini sudah diketahui dari AuthContext
  // Untuk contoh, kita anggap role = 'admin'
  const role = 'admin';

  return (
    <div className="flex flex-row bg-[#EEECEC]">
      <header className="flex  h-screen">
        <Sidebar role={role} />
      </header>
      <main className="flex  w-screen ">
        <div className="w-full flex flex-col h-screen scrollbar-hide overflow-y-auto gap-5">
          {children}
        </div>
      </main>
    </div>
  );
}
