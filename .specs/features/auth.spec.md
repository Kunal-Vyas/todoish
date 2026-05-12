# Authentication

User sign-up, sign-in, session management, and role-based authorization.

**Stage:** 🟠 Stage 3 &nbsp;|&nbsp; **Depends on:** _(none — foundational infrastructure)_

> **MVP note:** Authentication is deferred to Stage 3. The MVP operates as a single-user, local-only app with no sign-in required.

---

## Acceptance Criteria

### Sign-Up

- [ ] **AC-001: Email + password sign-up.** Given a valid email and password (min 8 chars), a new user account is created.
- [ ] **AC-002: Duplicate email rejected.** Signing up with an email already in use fails with a conflict error.
- [ ] **AC-003: Email verification.** After sign-up, a verification email is sent. The account is marked `verified: false` until confirmed.
- [ ] **AC-004: Password validation.** Password must be at least 8 characters. Empty or too-short passwords are rejected.
- [ ] **AC-005: OAuth sign-up.** A user can sign up via Google, GitHub, or Apple. No password is created for OAuth users.

### Sign-In

- [ ] **AC-006: Email + password sign-in.** Valid credentials return a session token.
- [ ] **AC-007: Invalid credentials.** Wrong password or non-existent email returns a generic "Invalid email or password" error (no user enumeration).
- [ ] **AC-008: OAuth sign-in.** Returning OAuth users are signed in without creating a duplicate account.
- [ ] **AC-009: Magic link sign-in.** Entering an email sends a one-time sign-in link. Clicking the link creates a session.
- [ ] **AC-010: Session persistence.** A signed-in session survives page reloads and browser restarts (via secure httpOnly cookie or token storage).

### Sign-Out

- [ ] **AC-011: Sign-out clears session.** After sign-out, the session token is invalidated and the user returns to the sign-in screen.
- [ ] **AC-012: Sign-out on all devices.** A "Sign out everywhere" option invalidates all sessions for the user.

### Authorization (RBAC)

- [ ] **AC-013: Project owner has full access.** The user who created a project can view, edit, delete tasks, manage members, and edit the project.
- [ ] **AC-014: Project editor can manage tasks.** Editors can view, edit, and delete tasks, and edit project details, but cannot manage members.
- [ ] **AC-015: Project viewer is read-only.** Viewers can see tasks but cannot create, edit, or delete them.
- [ ] **AC-016: Unauthenticated access denied.** Any request to a protected resource without a valid session returns 401.
- [ ] **AC-017: Wrong role access denied.** A viewer attempting to delete a task returns 403.

### Edge Cases

- [ ] **AC-018: Token expiry.** An expired session token returns 401. The client refreshes the token automatically if a refresh token is available.
- [ ] **AC-019: Concurrent sessions.** A user can be signed in on multiple devices simultaneously.
- [ ] **AC-020: Account deletion.** A user can delete their account. All their projects and tasks are also deleted after confirmation.
