export const billingStats = [
  {
    id: 'revenue',
    label: 'إيرادات الشهر',
    value: '361,000',
    unit: 'ر.س',
    delta: { value: '12%', dir: 'up' },
    note: 'عن يوليو',
    icon: 'card',
  },
  {
    id: 'pending',
    label: 'فواتير معلّقة',
    value: '23',
    valueColor: 'var(--warn)',
    note: 'بقيمة 8,450 ر.س',
    icon: 'clock',
  },
  {
    id: 'cash',
    label: 'مدفوع نقداً',
    value: '42',
    unit: '%',
    note: '58% بطاقة وتأمين',
    icon: 'cash',
  },
  {
    id: 'refunds',
    label: 'مسترجعات',
    value: '4',
    valueColor: 'var(--danger)',
    note: 'بقيمة 1,240 ر.س',
    icon: 'refund',
  },
]

// status: 'paid' | 'pending' | 'overdue' | 'refunded'
export const invoices = [
  { id: 1, number: 'INV-4421', patient: 'نورة العتيبي',  service: 'كشف باطنة',     doctor: 'د. خالد',    date: '4 أغسطس', amount: 150, method: 'مدى',       status: 'paid'     },
  { id: 2, number: 'INV-4420', patient: 'محمد الشمري',   service: 'كشف جلدية',     doctor: 'د. سارة',    date: '4 أغسطس', amount: 180, method: 'نقدي',      status: 'paid'     },
  { id: 3, number: 'INV-4419', patient: 'فاطمة القرشي',  service: 'تنظيف أسنان',   doctor: 'د. عبدالله', date: '4 أغسطس', amount: 250, method: 'تأمين',     status: 'pending'  },
  { id: 4, number: 'INV-4418', patient: 'سعد المطيري',   service: 'كشف + تحليل',   doctor: 'د. خالد',    date: '3 أغسطس', amount: 195, method: 'Apple Pay', status: 'paid'     },
  { id: 5, number: 'INV-4417', patient: 'هند الدوسري',   service: 'كشف أطفال',     doctor: 'د. رهف',     date: '3 أغسطس', amount: 130, method: 'مدى',       status: 'paid'     },
  { id: 6, number: 'INV-4416', patient: 'أحمد الغامدي',  service: 'أشعة صدر',      doctor: 'د. سارة',    date: '3 أغسطس', amount: 120, method: 'تأمين',     status: 'overdue'  },
  { id: 7, number: 'INV-4415', patient: 'خالد الحربي',   service: 'حشو أسنان',     doctor: 'د. عبدالله', date: '2 أغسطس', amount: 350, method: 'نقدي',      status: 'refunded' },
  { id: 8, number: 'INV-4414', patient: 'ريم الرشيدي',   service: 'استشارة عن بعد', doctor: 'د. خالد',   date: '2 أغسطس', amount: 80,  method: 'Apple Pay', status: 'paid'     },
]

export const STATUS_CONFIG = {
  paid:     { label: 'مدفوعة',   cls: 'ok'     },
  pending:  { label: 'معلّقة',   cls: 'warn'   },
  overdue:  { label: 'متأخرة',  cls: 'danger' },
  refunded: { label: 'مسترجعة', cls: 'info'   },
}
