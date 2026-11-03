/**
 * Security Tests — Phase 1 verification
 *
 * Test groups:
 *  A. isSuperAdmin logic unit tests              (SEC-01)
 *  B. hasPermission logic unit tests
 *  C. ProtectedRoute component tests             (SEC-02 / SEC-03)
 *  D. Route table guard coverage                 (SEC-03)
 *     — reads the REAL protectedRoutes array from routes/index.jsx
 *     — will FAIL if a guard is removed from that file
 *  E. Sidebar ↔ Route guard consistency
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createContext, useContext, createElement } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Pure-logic helper — mirrors AuthContext.jsx lines 16-27 exactly
// ─────────────────────────────────────────────────────────────────────────────
function buildAuthValues(user) {
  const permissions = user?.permissions ?? []
  const isSuperAdmin = user?.is_super_admin === true   // SEC-01 fix
  function hasPermission(slug) {
    if (isSuperAdmin) return true
    return permissions.includes(slug)
  }
  return { isSuperAdmin, hasPermission, isAuthenticated: user != null }
}

// ─────────────────────────────────────────────────────────────────────────────
// A. isSuperAdmin unit tests
// ─────────────────────────────────────────────────────────────────────────────
describe('A — SEC-01: isSuperAdmin logic', () => {
  it('TRUE  — is_super_admin: true, permissions: []', () => {
    expect(buildAuthValues({ is_super_admin: true, permissions: [] }).isSuperAdmin).toBe(true)
  })

  it('TRUE  — is_super_admin: true, permissions non-empty', () => {
    expect(buildAuthValues({ is_super_admin: true, permissions: ['doctors.view'] }).isSuperAdmin).toBe(true)
  })

  it('FALSE — is_super_admin: false, permissions: []  ← regression fix', () => {
    // Before fix: permissions.length === 0 → isSuperAdmin = true (wrong)
    expect(buildAuthValues({ is_super_admin: false, permissions: [] }).isSuperAdmin).toBe(false)
  })

  it('FALSE — is_super_admin: undefined, permissions: []', () => {
    expect(buildAuthValues({ permissions: [] }).isSuperAdmin).toBe(false)
  })

  it('FALSE — regular user with several permissions', () => {
    expect(buildAuthValues({ is_super_admin: false, permissions: ['doctors.view', 'clinics.view'] }).isSuperAdmin).toBe(false)
  })

  it('FALSE — null user (unauthenticated)', () => {
    expect(buildAuthValues(null).isSuperAdmin).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// B. hasPermission unit tests
// ─────────────────────────────────────────────────────────────────────────────
describe('B — hasPermission logic', () => {
  it('SuperAdmin passes every permission check', () => {
    const { hasPermission } = buildAuthValues({ is_super_admin: true, permissions: [] })
    expect(hasPermission('doctors.view')).toBe(true)
    expect(hasPermission('roles.view')).toBe(true)
    expect(hasPermission('anything.at.all')).toBe(true)
  })

  it('regular user passes only assigned permissions', () => {
    const { hasPermission } = buildAuthValues({
      is_super_admin: false,
      permissions: ['doctors.view', 'clinics.view'],
    })
    expect(hasPermission('doctors.view')).toBe(true)
    expect(hasPermission('clinics.view')).toBe(true)
    expect(hasPermission('roles.view')).toBe(false)
    expect(hasPermission('admins.view')).toBe(false)
  })

  it('user with empty permissions has NO access  ← regression fix', () => {
    const { hasPermission } = buildAuthValues({ is_super_admin: false, permissions: [] })
    expect(hasPermission('doctors.view')).toBe(false)
    expect(hasPermission('roles.view')).toBe(false)
    expect(hasPermission('admins.view')).toBe(false)
  })

  it('null user has no permissions', () => {
    const { hasPermission } = buildAuthValues(null)
    expect(hasPermission('doctors.view')).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// C. ProtectedRoute component tests
// ─────────────────────────────────────────────────────────────────────────────

// Mock useAuth before importing ProtectedRoute
const MockAuthCtx = createContext(null)
vi.mock('../context/AuthContext', () => ({
  useAuth: () => useContext(MockAuthCtx),
}))

const { default: ProtectedRoute } = await import('../routes/ProtectedRoute')

function renderProtected({ user, permission, superAdminOnly }) {
  const auth = buildAuthValues(user)
  return render(
    createElement(
      MockAuthCtx.Provider,
      { value: auth },
      createElement(
        MemoryRouter,
        { initialEntries: ['/target'] },
        createElement(
          Routes,
          null,
          createElement(Route, {
            path: '/login',
            element: createElement('div', null, 'LOGIN_PAGE'),
          }),
          createElement(Route, {
            path: '/target',
            element: createElement(
              ProtectedRoute,
              { permission, superAdminOnly },
              createElement('div', null, 'PROTECTED_CONTENT')
            ),
          })
        )
      )
    )
  )
}

describe('C1 — ProtectedRoute: unauthenticated user', () => {
  it('redirects to /login and hides content', () => {
    renderProtected({ user: null })
    expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument()
    expect(screen.queryByText('PROTECTED_CONTENT')).not.toBeInTheDocument()
  })

  it('redirects even on superAdminOnly route', () => {
    renderProtected({ user: null, superAdminOnly: true })
    expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument()
    expect(screen.queryByText('PROTECTED_CONTENT')).not.toBeInTheDocument()
  })

  it('redirects even on permission-guarded route', () => {
    renderProtected({ user: null, permission: 'doctors.view' })
    expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument()
    expect(screen.queryByText('PROTECTED_CONTENT')).not.toBeInTheDocument()
  })
})

describe('C2 — ProtectedRoute: authenticated, no guard', () => {
  it('allows access when no permission and no superAdminOnly required', () => {
    renderProtected({ user: { is_super_admin: false, permissions: [] } })
    expect(screen.getByText('PROTECTED_CONTENT')).toBeInTheDocument()
  })
})

describe('C3 — ProtectedRoute: permission guard', () => {
  it('DENIED — user has no matching permission', () => {
    renderProtected({
      user: { is_super_admin: false, permissions: ['clinics.view'] },
      permission: 'doctors.view',
    })
    expect(screen.getByText('ليس لديك صلاحية الوصول')).toBeInTheDocument()
    expect(screen.queryByText('PROTECTED_CONTENT')).not.toBeInTheDocument()
  })

  it('ALLOWED — user has the required permission', () => {
    renderProtected({
      user: { is_super_admin: false, permissions: ['doctors.view'] },
      permission: 'doctors.view',
    })
    expect(screen.getByText('PROTECTED_CONTENT')).toBeInTheDocument()
  })

  it('ALLOWED — SuperAdmin passes any permission check', () => {
    renderProtected({
      user: { is_super_admin: true, permissions: [] },
      permission: 'roles.view',
    })
    expect(screen.getByText('PROTECTED_CONTENT')).toBeInTheDocument()
  })

  it('DENIED — regression: empty permissions + is_super_admin:false → denied', () => {
    renderProtected({
      user: { is_super_admin: false, permissions: [] },
      permission: 'admins.view',
    })
    expect(screen.getByText('ليس لديك صلاحية الوصول')).toBeInTheDocument()
  })
})

describe('C4 — ProtectedRoute: superAdminOnly guard (Branding / Settings / Pages)', () => {
  it('DENIED — regular user with several permissions', () => {
    renderProtected({
      user: { is_super_admin: false, permissions: ['doctors.view', 'admins.view', 'roles.view'] },
      superAdminOnly: true,
    })
    expect(screen.getByText('ليس لديك صلاحية الوصول')).toBeInTheDocument()
    expect(screen.queryByText('PROTECTED_CONTENT')).not.toBeInTheDocument()
  })

  it('DENIED — regression: empty permissions + is_super_admin:false → denied', () => {
    renderProtected({
      user: { is_super_admin: false, permissions: [] },
      superAdminOnly: true,
    })
    expect(screen.getByText('ليس لديك صلاحية الوصول')).toBeInTheDocument()
  })

  it('ALLOWED — SuperAdmin (is_super_admin: true)', () => {
    renderProtected({
      user: { is_super_admin: true, permissions: [] },
      superAdminOnly: true,
    })
    expect(screen.getByText('PROTECTED_CONTENT')).toBeInTheDocument()
  })

  it('DENIED → redirect — unauthenticated on superAdminOnly route', () => {
    renderProtected({ user: null, superAdminOnly: true })
    expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// D. Route table guard coverage
//    Reads the REAL protectedRoutes array from routes/index.jsx.
//    These tests WILL FAIL if someone removes a guard from that file.
// ─────────────────────────────────────────────────────────────────────────────

// We cannot import JSX-rendering routes/index.jsx directly in a unit-test
// context without full React setup, but we CAN import it because Vitest
// transforms JSX and the lazy() calls are fine at import time (they're just
// function references, not called yet).
const { protectedRoutes } = await import('../routes/index.jsx')

describe('D — SEC-03: route table guard coverage (reads real routes/index.jsx)', () => {
  /**
   * For each entry we assert the ACTUAL value from protectedRoutes.
   * Format: [path-value, prop, expected-value]
   */
  const REQUIRED = [
    // superAdminOnly routes — Sidebar uses superAdminOnly: true
    ['/branding',    'superAdminOnly', true],
    ['/settings',    'superAdminOnly', true],
    ['/pages',       'superAdminOnly', true],
    // permission-guarded routes — permissions mirror Sidebar NAV
    ['/patients',    'permission', 'users.view'],
    ['/billing',     'permission', 'appointments.view'],
    ['/insurance',   'permission', 'appointments.view'],
    ['/reports',     'permission', 'appointments.view'],
    ['/analytics',   'permission', 'appointments.view'],
    ['/audit',       'permission', 'admins.view'],
    ['/services',    'permission', 'sub-specializations.view'],
    ['/time-tables', 'permission', 'time-tables.view'],
  ]

  REQUIRED.forEach(([path, prop, expected]) => {
    it(`"${path}" has ${prop}: ${JSON.stringify(expected)}`, () => {
      const route = protectedRoutes.find(r => r.path === path)
      expect(route, `route "${path}" not found in protectedRoutes`).toBeDefined()
      expect(route[prop]).toBe(expected)
    })
  })

  // Extra: verify the three previously-unguarded routes are no longer bare
  it('/branding has no "permission" (uses superAdminOnly instead)', () => {
    const r = protectedRoutes.find(r => r.path === '/branding')
    expect(r.permission).toBeUndefined()
  })

  it('/settings has no "permission" (uses superAdminOnly instead)', () => {
    const r = protectedRoutes.find(r => r.path === '/settings')
    expect(r.permission).toBeUndefined()
  })

  it('/pages has no "permission" (uses superAdminOnly instead)', () => {
    const r = protectedRoutes.find(r => r.path === '/pages')
    expect(r.permission).toBeUndefined()
  })

  // Verify previously-open routes now have a guard (neither permission nor
  // superAdminOnly was undefined before the fix)
  const PREVIOUSLY_OPEN = ['/patients', '/billing', '/insurance', '/reports',
                           '/analytics', '/audit', '/services']
  PREVIOUSLY_OPEN.forEach(path => {
    it(`"${path}" is no longer unguarded (must have permission or superAdminOnly)`, () => {
      const r = protectedRoutes.find(route => route.path === path)
      expect(r, `route "${path}" missing from protectedRoutes`).toBeDefined()
      const hasGuard = r.permission !== undefined || r.superAdminOnly === true
      expect(hasGuard, `route "${path}" has no guard — security hole`).toBe(true)
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// E. Sidebar ↔ Route guard consistency
//    For routes that appear in BOTH Sidebar NAV and protectedRoutes,
//    the permission slug must match.
// ─────────────────────────────────────────────────────────────────────────────
describe('E — Sidebar ↔ Route permission consistency', () => {
  /**
   * These pairs are manually verified against Sidebar.jsx NAV constant.
   * Sidebar permission → must match protectedRoutes permission.
   */
  const SIDEBAR_TO_ROUTE = [
    // [route-path,     sidebar-permission]
    ['/queue',          'appointments.view'],
    ['/calendar',       'appointments.view'],
    ['/patients',       'users.view'],
    ['/branches',       'clinics.view'],
    ['/clinics',        'clinics.view'],
    ['/doctors',        'doctors.view'],
    ['/staff',          'admins.view'],
    ['/roles',          'roles.view'],
    ['/cities',         'cities.view'],
    ['/locations',      'locations.view'],
    ['/clinic-managers','clinic-managers.view'],
    ['/notifications',  'push-notifications.view'],
    ['/banners',        'banners.view'],
    ['/offers',         'offers.view'],
    ['/promo-codes',    'promo-codes.view'],
    ['/splashes',       'splashes.view'],
    ['/contact-messages','contact-messages.view'],
    ['/contact-info',   'contact-info.view'],
  ]

  SIDEBAR_TO_ROUTE.forEach(([path, sidebarPerm]) => {
    it(`"${path}": route permission matches Sidebar ("${sidebarPerm}")`, () => {
      const route = protectedRoutes.find(r => r.path === path)
      expect(route, `route "${path}" missing from protectedRoutes`).toBeDefined()
      expect(route.permission).toBe(sidebarPerm)
    })
  })

  // superAdminOnly routes — Sidebar marks them superAdminOnly: true
  const SUPER_ADMIN_PATHS = ['/branding', '/settings', '/pages']
  SUPER_ADMIN_PATHS.forEach(path => {
    it(`"${path}": Sidebar superAdminOnly matches route superAdminOnly: true`, () => {
      const route = protectedRoutes.find(r => r.path === path)
      expect(route?.superAdminOnly).toBe(true)
    })
  })
})
