# Role Validation Matrix

| Role | Login Account | Allowed Route Check | Denied Route Check | Expected Redirect |
|---|---|---|---|---|
| ADMIN | `admin@rootwork.edu` | `/admin` | `/student` | `/admin` |
| TEACHER | `msmith@rootwork.edu` | `/teacher` | `/admin` | `/teacher` |
| STUDENT | `noah.3@rootwork.edu` | `/student` | `/admin` | `/student` |
| PARENT | `parent.anderson@email.com` | `/parent` | `/teacher` | `/parent` |

## Shared Test Password
- `demo123`

## Execution
- Local: `pnpm --filter web e2e:role`
- CI: `.github/workflows/role-e2e.yml`
