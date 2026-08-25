export const doctorStats = [
  { id: 'total',   label: 'إجمالي الأطباء',    value: '24',  note: '18 نشط · 4 إجازة · 2 غير نشط', icon: 'doctor'  },
  { id: 'onduty',  label: 'في الدوام الآن',    value: '14',  note: 'حالياً في العيادات',              icon: 'clock'   },
  { id: 'rating',  label: 'متوسط التقييم',     value: '4.7', note: 'من 5 نجوم',                      icon: 'star'    },
  { id: 'license', label: 'رخص تحتاج تجديد',  value: '3',   note: 'خلال 60 يوماً',                  icon: 'shield', valueColor: 'var(--warn)' },
]

export const specialtyFilters = [
  { id: 'all',      label: 'كل التخصصات' },
  { id: 'internal', label: 'باطنة' },
  { id: 'skin',     label: 'جلدية' },
  { id: 'dental',   label: 'أسنان' },
  { id: 'pediatric',label: 'أطفال' },
  { id: 'more',     label: '+4' },
]

export const doctors = [
  {
    id: 1, initial: 'خ', name: 'د. خالد العتيبي',  specialty: 'باطنة عامة',    specialtyId: 'internal',
    branch: 'العليا',           phone: '+966 55 XXX 1122', license: '2027-03-15',
    licenseExpiring: false, visits: 245, rating: 4.9, status: 'active',
  },
  {
    id: 2, initial: 'س', name: 'د. سارة الحربي',   specialty: 'جلدية',          specialtyId: 'skin',
    branch: 'النخيل · الملقا',   phone: '+966 55 XXX 2233', license: '2026-09-22',
    licenseExpiring: true,  visits: 198, rating: 4.8, status: 'active',
  },
  {
    id: 3, initial: 'ع', name: 'د. عبدالله السالم', specialty: 'أسنان',         specialtyId: 'dental',
    branch: 'العليا · الملقا',   phone: '+966 55 XXX 3344', license: '2027-06-10',
    licenseExpiring: false, visits: 210, rating: 4.7, status: 'active',
  },
  {
    id: 4, initial: 'ر', name: 'د. رهف العنزي',    specialty: 'أطفال',          specialtyId: 'pediatric',
    branch: 'النخيل',            phone: '+966 55 XXX 4455', license: '2028-01-05',
    licenseExpiring: false, visits: 165, rating: 4.9, status: 'active',
  },
  {
    id: 5, initial: 'ن', name: 'د. نواف الشمري',   specialty: 'باطنة',          specialtyId: 'internal',
    branch: 'العليا',            phone: '+966 55 XXX 5566', license: '2027-11-20',
    licenseExpiring: false, visits: 178, rating: 4.6, status: 'active',
  },
  {
    id: 6, initial: 'ف', name: 'د. فهد القحطاني',  specialty: 'عظام',           specialtyId: 'more',
    branch: 'العليا',            phone: '+966 55 XXX 6677', license: '2026-10-05',
    licenseExpiring: true,  visits: 132, rating: 4.7, status: 'active',
  },
  {
    id: 7, initial: 'م', name: 'د. منى الدوسري',   specialty: 'نساء وولادة',    specialtyId: 'more',
    branch: 'العليا · الملقا',   phone: '+966 55 XXX 7788', license: '2027-04-18',
    licenseExpiring: false, visits: 154, rating: 4.8, status: 'active',
  },
  {
    id: 8, initial: 'ي', name: 'د. ياسر العتيبي',  specialty: 'أنف وأذن',       specialtyId: 'more',
    branch: 'الملقا',            phone: '+966 55 XXX 8899', license: '2028-02-14',
    licenseExpiring: false, visits: 108, rating: 4.5, status: 'leave',
  },
]
