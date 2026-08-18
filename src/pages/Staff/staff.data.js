export const staffStats = [
  {
    id: 'total',
    label: 'إجمالي المستخدمين',
    value: '32',
    note: '28 نشط · 4 معطّل',
    icon: 'users',
  },
  {
    id: 'admins',
    label: 'مديرو النظام',
    value: '2',
    note: 'صلاحيات كاملة',
    icon: 'shield',
  },
  {
    id: 'managers',
    label: 'مديرو الفروع',
    value: '3',
    note: 'فرع لكل مدير',
    icon: 'building',
  },
  {
    id: 'reception',
    label: 'الاستقبال',
    value: '18',
    note: 'مع صلاحيات الحجز',
    icon: 'person',
  },
]

// role: 'admin' | 'branch_manager' | 'clinic_manager' | 'reception'
// status: 'active' | 'disabled'
export const staffMembers = [
  { id: 1, initial: 'ن', name: 'ناصر السالم',   email: 'nasser@shifa.sa', role: 'admin',           roleLabel: 'مدير النظام', roleChip: 'info', branch: 'كل الفروع',     lastLogin: 'الآن',         status: 'active'   },
  { id: 2, initial: 'ف', name: 'فيصل الحارثي',  email: 'faisal@shifa.sa', role: 'admin',           roleLabel: 'مدير النظام', roleChip: 'info', branch: 'كل الفروع',     lastLogin: 'اليوم 9:15 ص', status: 'active'   },
  { id: 3, initial: 'ت', name: 'تركي المالكي',  email: 'turki@shifa.sa',  role: 'branch_manager',  roleLabel: 'مدير فرع',    roleChip: 'ok',   branch: 'العليا',        lastLogin: 'اليوم 8:30 ص', status: 'active'   },
  { id: 4, initial: 'م', name: 'مها العنزي',    email: 'maha@shifa.sa',   role: 'branch_manager',  roleLabel: 'مدير فرع',    roleChip: 'ok',   branch: 'النخيل',        lastLogin: 'أمس 4:20 م',   status: 'active'   },
  { id: 5, initial: 'ع', name: 'عادل السبيعي',  email: 'adel@shifa.sa',   role: 'branch_manager',  roleLabel: 'مدير فرع',    roleChip: 'ok',   branch: 'الملقا',        lastLogin: 'اليوم 7:45 ص', status: 'active'   },
  { id: 6, initial: 'ه', name: 'هدى الشمري',    email: 'huda@shifa.sa',   role: 'clinic_manager',  roleLabel: 'مدير عيادة',  roleChip: 'warn', branch: 'العليا · باطنة', lastLogin: 'اليوم 10:00 ص', status: 'active'  },
  { id: 7, initial: 'ر', name: 'رائد الحربي',   email: 'raed@shifa.sa',   role: 'reception',       roleLabel: 'استقبال',     roleChip: 'mut',  branch: 'العليا',        lastLogin: 'اليوم 7:30 ص', status: 'active'   },
  { id: 8, initial: 'ل', name: 'ليلى القحطاني', email: 'layla@shifa.sa',  role: 'reception',       roleLabel: 'استقبال',     roleChip: 'mut',  branch: 'النخيل',        lastLogin: 'اليوم 8:00 ص', status: 'active'   },
  { id: 9, initial: 'ج', name: 'جابر الدوسري',  email: 'jaber@shifa.sa',  role: 'reception',       roleLabel: 'استقبال',     roleChip: 'mut',  branch: 'الملقا',        lastLogin: '3 أيام',       status: 'disabled' },
]
