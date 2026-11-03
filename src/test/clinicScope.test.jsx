/**
 * Clinic Scope Tests — adminClinicIds fix
 *
 * Tests:
 *  A. getClinicParams() — pure logic from AuthContext
 *  B. useClinics — enabled flag behaviour
 *  C. useDoctors / useAppointments / useTimeTables / usePatients — enabled flag
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ─────────────────────────────────────────────────────────────────────────────
// A. getClinicParams() pure-logic tests
//    (mirrors AuthContext.jsx exactly — no React needed)
// ─────────────────────────────────────────────────────────────────────────────

function buildClinicScope(user) {
  const managesAllClinics = user?.manages_all_clinics === true
  const adminClinicIds = managesAllClinics
    ? null
    : (user?.clinics?.map(c => c.id) ?? [])

  function getClinicParams() {
    if (managesAllClinics || adminClinicIds === null) return {}
    if (adminClinicIds.length === 0) return null
    return { clinic_id: adminClinicIds[0] }
  }

  return { managesAllClinics, adminClinicIds, getClinicParams }
}

describe('A — getClinicParams() logic', () => {
  describe('Super Admin (is_super_admin: true, manages_all_clinics: true)', () => {
    it('returns {} — full access, no clinic filter', () => {
      const { getClinicParams } = buildClinicScope({ is_super_admin: true, manages_all_clinics: true, clinics: [] })
      expect(getClinicParams()).toEqual({})
    })
  })

  describe('manages_all_clinics: true (non-superadmin manager)', () => {
    it('returns {} even when clinics array is empty', () => {
      const { getClinicParams } = buildClinicScope({ is_super_admin: false, manages_all_clinics: true, clinics: [] })
      expect(getClinicParams()).toEqual({})
    })

    it('returns {} even when clinics array has items', () => {
      const { getClinicParams } = buildClinicScope({ is_super_admin: false, manages_all_clinics: true, clinics: [{ id: 1 }, { id: 2 }] })
      expect(getClinicParams()).toEqual({})
    })
  })

  describe('manages_all_clinics: false — specific clinics assigned', () => {
    it('returns { clinic_id: firstId } when one clinic assigned', () => {
      const { getClinicParams } = buildClinicScope({ is_super_admin: false, manages_all_clinics: false, clinics: [{ id: 5 }] })
      expect(getClinicParams()).toEqual({ clinic_id: 5 })
    })

    it('returns { clinic_id: firstId } when multiple clinics assigned', () => {
      const { getClinicParams } = buildClinicScope({ is_super_admin: false, manages_all_clinics: false, clinics: [{ id: 3 }, { id: 7 }] })
      expect(getClinicParams()).toEqual({ clinic_id: 3 })
    })
  })

  describe('manages_all_clinics: false — NO clinics assigned (the bug)', () => {
    it('returns null  ← was {} before fix (would have leaked all data)', () => {
      const { getClinicParams } = buildClinicScope({ is_super_admin: false, manages_all_clinics: false, clinics: [] })
      expect(getClinicParams()).toBe(null)
    })

    it('returns null when user.clinics is undefined', () => {
      const { getClinicParams } = buildClinicScope({ is_super_admin: false, manages_all_clinics: false })
      expect(getClinicParams()).toBe(null)
    })
  })

  describe('adminClinicIds derivation', () => {
    it('is null when manages_all_clinics: true', () => {
      const { adminClinicIds } = buildClinicScope({ manages_all_clinics: true, clinics: [{ id: 1 }] })
      expect(adminClinicIds).toBe(null)
    })

    it('is [] when manages_all_clinics: false and no clinics', () => {
      const { adminClinicIds } = buildClinicScope({ manages_all_clinics: false, clinics: [] })
      expect(adminClinicIds).toEqual([])
    })

    it('is [ids] when manages_all_clinics: false with clinics', () => {
      const { adminClinicIds } = buildClinicScope({ manages_all_clinics: false, clinics: [{ id: 2 }, { id: 4 }] })
      expect(adminClinicIds).toEqual([2, 4])
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// B & C — Hook enabled-flag tests
//    We mock useAuth and the API modules, then assert whether each hook
//    fires (or does NOT fire) a fetch for each user type.
// ─────────────────────────────────────────────────────────────────────────────

// Mocks — placed before any hook imports
const mockGetClinicParams = vi.fn()
const mockManagesAllClinics = vi.fn()
const mockAdminClinicIds = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    getClinicParams: mockGetClinicParams,
    managesAllClinics: mockManagesAllClinics(),
    adminClinicIds: mockAdminClinicIds(),
  }),
}))

// API mocks — track whether fetch was called
const mockGetClinicsApi      = vi.fn()
const mockGetDoctorsApi      = vi.fn()
const mockGetAppointmentsApi = vi.fn()
const mockGetTimeTablesApi   = vi.fn()
const mockGetPatientsApi     = vi.fn()

vi.mock('../api/clinics.api', () => ({
  getClinicsApi: (...args) => mockGetClinicsApi(...args),
}))
vi.mock('../api/doctors.api', () => ({
  getDoctorsApi:      (...args) => mockGetDoctorsApi(...args),
  getTopRatedDoctorsApi: () => Promise.resolve({ data: { data: [] } }),
}))
vi.mock('../api/appointments.api', () => ({
  getAppointmentsApi: (...args) => mockGetAppointmentsApi(...args),
}))
vi.mock('../api/time-tables.api', () => ({
  getTimeTablesApi:   (...args) => mockGetTimeTablesApi(...args),
}))
vi.mock('../api/patients.api', () => ({
  getPatientsApi:     (...args) => mockGetPatientsApi(...args),
}))

// Lazy imports — AFTER vi.mock declarations
const { useClinics }      = await import('../hooks/queries/useClinics')
const { useDoctors }      = await import('../hooks/queries/useDoctors')
const { useAppointments } = await import('../hooks/queries/useAppointments')
const { useTimeTables }   = await import('../hooks/queries/useTimeTables')
const { usePatients }     = await import('../hooks/queries/usePatients')

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }) => createElement(QueryClientProvider, { client: qc }, children)
}

beforeEach(() => {
  vi.clearAllMocks()
  // Default responses for the happy-path tests
  mockGetClinicsApi.mockResolvedValue({ data: { data: [{ id: 1, name: { ar: 'عيادة 1' } }] } })
  mockGetDoctorsApi.mockResolvedValue({ data: { data: [] } })
  mockGetAppointmentsApi.mockResolvedValue({ data: { data: [] } })
  mockGetTimeTablesApi.mockResolvedValue({ data: { data: [] } })
  mockGetPatientsApi.mockResolvedValue({ data: { data: [] } })
})

// Helper — configure the auth mock for a given user type
function setAuthScope({ managesAll, clinicIds, clinicParamsReturn }) {
  mockManagesAllClinics.mockReturnValue(managesAll)
  mockAdminClinicIds.mockReturnValue(clinicIds)
  mockGetClinicParams.mockReturnValue(clinicParamsReturn)
}

// ── User type 1: manages_all_clinics: true ──────────────────────────────────

describe('B — useClinics: manages_all_clinics: true', () => {
  it('fires the API call and returns all clinics', async () => {
    setAuthScope({ managesAll: true, clinicIds: null, clinicParamsReturn: {} })
    const { result } = renderHook(() => useClinics(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetClinicsApi).toHaveBeenCalledTimes(1)
    expect(result.current.data).toHaveLength(1)
  })
})

describe('C — useDoctors/useAppointments/useTimeTables/usePatients: manages_all_clinics: true', () => {
  it('useDoctors fires the API call', async () => {
    setAuthScope({ managesAll: true, clinicIds: null, clinicParamsReturn: {} })
    const { result } = renderHook(() => useDoctors(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetDoctorsApi).toHaveBeenCalledTimes(1)
  })

  it('useAppointments fires the API call', async () => {
    setAuthScope({ managesAll: true, clinicIds: null, clinicParamsReturn: {} })
    const { result } = renderHook(() => useAppointments(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetAppointmentsApi).toHaveBeenCalledTimes(1)
  })

  it('useTimeTables fires the API call', async () => {
    setAuthScope({ managesAll: true, clinicIds: null, clinicParamsReturn: {} })
    const { result } = renderHook(() => useTimeTables(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetTimeTablesApi).toHaveBeenCalledTimes(1)
  })

  it('usePatients fires the API call', async () => {
    setAuthScope({ managesAll: true, clinicIds: null, clinicParamsReturn: {} })
    const { result } = renderHook(() => usePatients(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetPatientsApi).toHaveBeenCalledTimes(1)
  })
})

// ── User type 2: manages_all_clinics:false, specific clinics ────────────────

describe('B — useClinics: manages_all_clinics:false, clinics assigned', () => {
  it('fires the API call and filters to assigned IDs', async () => {
    setAuthScope({ managesAll: false, clinicIds: [1], clinicParamsReturn: { clinic_id: 1 } })
    // API returns two clinics; only id:1 matches
    mockGetClinicsApi.mockResolvedValue({
      data: { data: [{ id: 1, name: { ar: 'عيادة 1' } }, { id: 2, name: { ar: 'عيادة 2' } }] }
    })
    const { result } = renderHook(() => useClinics(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetClinicsApi).toHaveBeenCalledTimes(1)
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].id).toBe(1)
  })
})

describe('C — useDoctors/useAppointments/useTimeTables/usePatients: specific clinics', () => {
  it('useDoctors fires with clinic_id param', async () => {
    setAuthScope({ managesAll: false, clinicIds: [3], clinicParamsReturn: { clinic_id: 3 } })
    const { result } = renderHook(() => useDoctors(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetDoctorsApi).toHaveBeenCalledWith({ clinic_id: 3 })
  })

  it('usePatients fires with clinic_id param', async () => {
    setAuthScope({ managesAll: false, clinicIds: [3], clinicParamsReturn: { clinic_id: 3 } })
    const { result } = renderHook(() => usePatients(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetPatientsApi).toHaveBeenCalledWith({ clinic_id: 3 })
  })
})

// ── User type 3: manages_all_clinics:false, NO clinics ──────────────────────

describe('B — useClinics: manages_all_clinics:false, clinics: [] (the fix)', () => {
  it('does NOT fire the API call', async () => {
    setAuthScope({ managesAll: false, clinicIds: [], clinicParamsReturn: null })
    const { result } = renderHook(() => useClinics(), { wrapper: makeWrapper() })
    // Give time for any erroneous call to fire
    await new Promise(r => setTimeout(r, 80))
    expect(mockGetClinicsApi).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })
})

describe('C — no API calls when no clinics assigned (the fix)', () => {
  it('useDoctors does NOT fire', async () => {
    setAuthScope({ managesAll: false, clinicIds: [], clinicParamsReturn: null })
    renderHook(() => useDoctors(), { wrapper: makeWrapper() })
    await new Promise(r => setTimeout(r, 80))
    expect(mockGetDoctorsApi).not.toHaveBeenCalled()
  })

  it('useAppointments does NOT fire', async () => {
    setAuthScope({ managesAll: false, clinicIds: [], clinicParamsReturn: null })
    renderHook(() => useAppointments(), { wrapper: makeWrapper() })
    await new Promise(r => setTimeout(r, 80))
    expect(mockGetAppointmentsApi).not.toHaveBeenCalled()
  })

  it('useTimeTables does NOT fire', async () => {
    setAuthScope({ managesAll: false, clinicIds: [], clinicParamsReturn: null })
    renderHook(() => useTimeTables(), { wrapper: makeWrapper() })
    await new Promise(r => setTimeout(r, 80))
    expect(mockGetTimeTablesApi).not.toHaveBeenCalled()
  })

  it('usePatients does NOT fire', async () => {
    setAuthScope({ managesAll: false, clinicIds: [], clinicParamsReturn: null })
    renderHook(() => usePatients(), { wrapper: makeWrapper() })
    await new Promise(r => setTimeout(r, 80))
    expect(mockGetPatientsApi).not.toHaveBeenCalled()
  })
})
