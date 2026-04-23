import { Menu } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import Select from '../ui/Select';
import { MONTHS, YEARS } from '../../lib/constants';

export default function Header() {
  const { selectedMonth, selectedYear, setMonth, setYear, toggleSidebar } = useUiStore();

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-6 border-b border-border bg-surface px-4 shadow-sm sm:px-6 lg:px-8">
      <button 
        type="button" 
        onClick={toggleSidebar}
        className="-m-2.5 p-2.5 text-text-muted lg:hidden hover:text-text-main transition-colors"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-bold font-display text-primary hidden sm:block">النظرة العامة</h1>
        <div className="flex items-center gap-x-4 mr-auto">
          <div className="w-40">
            <Select
              value={selectedMonth}
              onChange={(e) => setMonth(Number(e.target.value))}
              options={MONTHS}
              className="bg-background border-border shadow-sm h-10 text-sm font-medium"
            />
          </div>
          <div className="w-32">
            <Select
              value={selectedYear}
              onChange={(e) => setYear(Number(e.target.value))}
              options={YEARS}
              className="bg-background border-border shadow-sm h-10 text-sm font-medium"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
