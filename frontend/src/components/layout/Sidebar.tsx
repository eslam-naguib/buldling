import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Building2, Receipt, LogOut, FileText, Settings, ShieldCheck, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { authApi } from '../../api/auth.api';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: Home },
  { name: 'إدارة الشقق', href: '/flats', icon: Building2 },
  { name: 'المصروفات', href: '/transactions', icon: Receipt },
  { name: 'التقارير والإحصائيات', href: '/reports', icon: FileText },
  { name: 'الإعدادات', href: '/settings', icon: Settings },
];

export default function Sidebar({ className }: { className?: string }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <div className={cn("flex flex-col border-l border-border bg-surface", className)}>
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-border gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold font-display text-text-main leading-tight">إدارة العمارة</h1>
          <p className="text-[10px] text-text-muted font-medium tracking-wider uppercase mt-0.5">Estate Engine</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        <div className="text-xs font-semibold text-text-muted mb-4 px-2 tracking-wide">القائمة الرئيسية</div>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-text-muted hover:bg-surface-container-highest hover:text-text-main"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "ml-3 h-5 w-5 shrink-0 transition-transform duration-300",
                    isActive ? "text-white" : "text-text-muted group-hover:text-primary group-hover:scale-110"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border bg-surface-container-low/50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-2 ring-primary/20">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-text-main truncate">مدير النظام</p>
            <p className="text-xs text-text-muted truncate">admin@building.com</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="group flex w-full justify-center items-center gap-2 rounded-xl bg-danger/10 px-4 py-2.5 text-sm font-bold text-danger hover:bg-danger hover:text-white transition-all duration-300 border border-danger/20 hover:border-danger shadow-sm hover:shadow-md hover:shadow-danger/20"
        >
          <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
