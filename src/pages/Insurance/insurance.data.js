export const insuranceStats = [
  {
    id: 'claims',
    label: 'مطالبات الشهر',
    value: '87',
    delta: { value: '15%', dir: 'up' },
    icon: 'shield',
  },
  {
    id: 'value',
    label: 'قيمة المطالبات',
    value: '124,500',
    unit: 'ر.س',
    icon: 'card',
  },
  {
    id: 'approved',
    label: 'معتمدة',
    value: '72',
    valueColor: 'var(--ok)',
    note: '83% نسبة القبول',
    icon: 'check',
  },
  {
    id: 'rejected',
    label: 'مرفوضة',
    value: '8',
    valueColor: 'var(--danger)',
    note: 'بقيمة 12,300 ر.س',
    icon: 'x',
  },
]

export const insuranceCompanies = [
  { id: 1, name: 'بوبا العربية',   active: 34, approved: 28, rejected: 3, pending: 3, totalValue: '48,200' },
  { id: 2, name: 'التعاونية',      active: 28, approved: 24, rejected: 2, pending: 2, totalValue: '38,800' },
  { id: 3, name: 'ميدغلف',         active: 18, approved: 15, rejected: 2, pending: 1, totalValue: '25,600' },
  { id: 4, name: 'الراجحي تكافل', active: 7,  approved: 5,  rejected: 1, pending: 1, totalValue: '11,900' },
]
