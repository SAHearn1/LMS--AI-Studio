param(
  [switch]$SkipSeed
)

$ErrorActionPreference = 'Stop'

Write-Host 'Generating Prisma client...'
pnpm --filter @rootwork/database generate

Write-Host 'Pushing Prisma schema...'
pnpm --filter @rootwork/database push

if (-not $SkipSeed) {
  Write-Host 'Seeding deterministic role fixtures...'
  pnpm --filter @rootwork/database seed
}

Write-Host 'Running role E2E validation...'
pnpm --filter web e2e:role

Write-Host 'Role validation run complete.'
