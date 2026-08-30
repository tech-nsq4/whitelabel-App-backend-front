import client from './client'

export const getAppointmentsApi          = (params)     => client.get('/api/admin/appointments', { params })
export const getAppointmentApi           = (id)         => client.get(`/api/admin/appointments/${id}`)
export const updateAppointmentApi        = (id, data)   => client.put(`/api/admin/appointments/${id}`, data)
export const getAppointmentStatisticsApi = ()           => client.get('/api/admin/appointments/statistics')
export const uploadTestResultApi         = (appointmentId, testRequestId, formData) =>
  client.post(`/api/admin/appointments/${appointmentId}/test-requests/${testRequestId}/result`, formData)
export const uploadPrescriptionImageApi  = (appointmentId, formData) =>
  client.post(`/api/admin/appointments/${appointmentId}/prescription-image`, formData)
