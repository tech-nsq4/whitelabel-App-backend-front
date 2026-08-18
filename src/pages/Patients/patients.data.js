export const patientStats = [
  {
    id: 'total',
    label: 'إجمالي المرضى',
    value: '3,241',
    delta: '+142',
    deltaType: 'up',
    note: 'هذا الشهر',
    icon: 'group',
  },
  {
    id: 'active',
    label: 'مرضى نشطون',
    value: '2,458',
    note: 'زيارة خلال 6 أشهر',
    icon: 'person',
  },
  {
    id: 'vip',
    label: 'مرضى VIP',
    value: '184',
    note: 'من كبار المستفيدين',
    icon: 'star',
  },
  {
    id: 'today',
    label: 'التسجيلات اليوم',
    value: '7',
    note: 'مريض جديد اليوم',
    icon: 'plus',
  },
]

export const statusFilters = [
  { id: 'all',      label: 'الكل (3,241)' },
  { id: 'active',   label: 'نشطون (2,458)' },
  { id: 'vip',      label: 'VIP (184)' },
  { id: 'inactive', label: 'غير نشطين (783)' },
]

// status: 'active' | 'vip' | 'inactive'
export const patients = [
  { id: 1,  initial: 'ن', name: 'نورة العتيبي',    fileNo: 'ملف #30412', idNo: '1098776554', phone: '+966 5X XXX 4412', lastVisit: 'اليوم',      visits: 14, status: 'active'   },
  { id: 2,  initial: 'م', name: 'محمد الشمري',     fileNo: 'ملف #30298', idNo: '1102345678', phone: '+966 5X XXX 2298', lastVisit: 'أمس',        visits: 8,  status: 'active'   },
  { id: 3,  initial: 'ف', name: 'فاطمة القرشي',    fileNo: 'ملف #30115', idNo: '1088123456', phone: '+966 5X XXX 8115', lastVisit: '3 أيام',     visits: 22, status: 'vip'      },
  { id: 4,  initial: 'س', name: 'سعد المطيري',     fileNo: 'ملف #29882', idNo: '1076543210', phone: '+966 5X XXX 6882', lastVisit: '1 أسبوع',    visits: 5,  status: 'active'   },
  { id: 5,  initial: 'ه', name: 'هند الدوسري',     fileNo: 'ملف #29710', idNo: '1112234567', phone: '+966 5X XXX 4710', lastVisit: '2 أسبوع',    visits: 11, status: 'active'   },
  { id: 6,  initial: 'أ', name: 'أحمد الغامدي',    fileNo: 'ملف #29655', idNo: '1067890123', phone: '+966 5X XXX 9655', lastVisit: '1 شهر',      visits: 3,  status: 'active'   },
  { id: 7,  initial: 'خ', name: 'خالد الحربي',     fileNo: 'ملف #29542', idNo: '1054321098', phone: '+966 5X XXX 1542', lastVisit: '2 شهر',      visits: 6,  status: 'active'   },
  { id: 8,  initial: 'ر', name: 'ريم الرشيدي',     fileNo: 'ملف #29401', idNo: '1099887766', phone: '+966 5X XXX 9401', lastVisit: '4 شهر',      visits: 4,  status: 'inactive' },
  { id: 9,  initial: 'ع', name: 'عبدالرحمن الفهد', fileNo: 'ملف #29387', idNo: '1087654321', phone: '+966 5X XXX 3387', lastVisit: '5 شهر',      visits: 2,  status: 'inactive' },
  { id: 10, initial: 'ل', name: 'لطيفة العتيبي',   fileNo: 'ملف #29488', idNo: '1076543210', phone: '+966 5X XXX 4488', lastVisit: '3 أسابيع',   visits: 9,  status: 'active'   },
]
