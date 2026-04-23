export const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export const MONTHS = MONTHS_AR.map((m, i) => ({ value: i + 1, label: m }));
export const YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() - 2 + i;
  return { value: year, label: year.toString() };
});

export const CATEGORIES: Record<string, string> = {
  maintenance_fee: 'رسوم صيانة',
  elevator: 'مصعد',
  cleaning: 'نظافة',
  electricity: 'كهرباء',
  water: 'مياه',
  other: 'أخرى',
};

export const EXPENSE_CATEGORIES = [
  { value: 'elevator', label: 'مصعد' },
  { value: 'cleaning', label: 'نظافة' },
  { value: 'electricity', label: 'كهرباء' },
  { value: 'water', label: 'مياه' },
  { value: 'other', label: 'أخرى' },
];

export const TYPE_LABELS: Record<string, string> = {
  income: 'دخول',
  expense: 'خروج',
};
