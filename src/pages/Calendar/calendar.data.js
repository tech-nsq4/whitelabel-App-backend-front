// Doctors displayed as columns
export const calendarDoctors = [
  { id: 'khalid',   name: 'د. خالد',   shortName: 'خالد',   specialty: 'باطنة',  color: '#0F6B5C' },
  { id: 'sara',     name: 'د. سارة',   shortName: 'سارة',   specialty: 'جلدية',  color: '#B3402F' },
  { id: 'abdullah', name: 'د. عبدالله',shortName: 'عبدالله',specialty: 'أسنان',  color: '#2C6DAA' },
  { id: 'rahaf',    name: 'د. رهف',    shortName: 'رهف',    specialty: 'أطفال',  color: '#C9A227' },
]

// Time slots shown in day view
export const timeSlots = [
  '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '1:00 م', '1:30 م', '2:00 م', '2:30 م',
  '3:00 م', '3:30 م', '4:00 م',
]

export const branchFilters = [
  { id: 'all',     label: 'كل الفروع' },
  { id: 'olaya',   label: 'العليا' },
  { id: 'nakheel', label: 'النخيل' },
  { id: 'malqa',   label: 'الملقا' },
]

// appointments: doctorId maps to calendarDoctors id
export const appointments = [
  { id: 1,  time: '9:00',    doctorId: 'khalid',   patientName: 'أحمد الحربي',      branch: 'olaya'   },
  { id: 2,  time: '9:00',    doctorId: 'sara',     patientName: 'ريم الرشيدي',      branch: 'nakheel' },
  { id: 3,  time: '9:30',    doctorId: 'abdullah', patientName: 'محمد السعد',       branch: 'malqa'   },
  { id: 4,  time: '9:30',    doctorId: 'rahaf',    patientName: 'طفل الشمري',       branch: 'olaya'   },
  { id: 5,  time: '10:00',   doctorId: 'khalid',   patientName: 'نورة العتيبي',     branch: 'olaya'   },
  { id: 6,  time: '10:00',   doctorId: 'sara',     patientName: 'فاطمة القحطاني',   branch: 'olaya'   },
  { id: 7,  time: '10:30',   doctorId: 'khalid',   patientName: 'سعد المطيري',      branch: 'olaya'   },
  { id: 8,  time: '10:30',   doctorId: 'abdullah', patientName: 'خالد الحربي',      branch: 'nakheel' },
  { id: 9,  time: '11:00',   doctorId: 'sara',     patientName: 'محمد الشمري',      branch: 'nakheel' },
  { id: 10, time: '11:00',   doctorId: 'rahaf',    patientName: 'هند الدوسري',      branch: 'malqa'   },
  { id: 11, time: '11:30',   doctorId: 'khalid',   patientName: 'يوسف الشهري',      branch: 'olaya'   },
  { id: 12, time: '11:30',   doctorId: 'abdullah', patientName: 'فاطمة القرشي',     branch: 'olaya'   },
  { id: 13, time: '12:00',   doctorId: 'sara',     patientName: 'أحمد الغامدي',     branch: 'olaya'   },
  { id: 14, time: '12:00',   doctorId: 'rahaf',    patientName: 'لطيفة العتيبي',    branch: 'nakheel' },
  { id: 15, time: '1:00 م',  doctorId: 'khalid',   patientName: 'عبدالرحمن الفهد',  branch: 'olaya'   },
  { id: 16, time: '1:30 م',  doctorId: 'abdullah', patientName: 'مريم الحربي',      branch: 'malqa'   },
  { id: 17, time: '2:00 م',  doctorId: 'sara',     patientName: 'خالد السالم',      branch: 'olaya'   },
  { id: 18, time: '2:00 م',  doctorId: 'rahaf',    patientName: 'طفلة العنزي',      branch: 'nakheel' },
  { id: 19, time: '2:30 م',  doctorId: 'khalid',   patientName: 'مشاري الدوسري',    branch: 'olaya'   },
  { id: 20, time: '3:00 م',  doctorId: 'abdullah', patientName: 'رهف الشمري',       branch: 'malqa'   },
  { id: 21, time: '3:00 م',  doctorId: 'rahaf',    patientName: 'يزن العتيبي',      branch: 'olaya'   },
  { id: 22, time: '3:30 م',  doctorId: 'sara',     patientName: 'نايف الحربي',      branch: 'nakheel' },
  { id: 23, time: '4:00 م',  doctorId: 'khalid',   patientName: 'شهد المطيري',      branch: 'olaya'   },
  { id: 24, time: '4:00 م',  doctorId: 'abdullah', patientName: 'عبدالله السعد',    branch: 'malqa'   },
]
