import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const oxlint = fileURLToPath(
  new URL('../../node_modules/.bin/oxlint', import.meta.url),
);
const sampleModule = fileURLToPath(
  new URL('fixtures/src/modules/sample/', import.meta.url),
);

interface OxlintReport {
  diagnostics: { code: string }[];
}

function lintErrors(fixture: string): string[] {
  const { stdout, error } = spawnSync(
    oxlint,
    ['--format', 'json', sampleModule + fixture],
    { encoding: 'utf8' },
  );
  if (error) throw error;
  const report = JSON.parse(stdout) as OxlintReport;
  return report.diagnostics.map((diagnostic) => diagnostic.code);
}

const boundaryError = 'eslint(no-restricted-imports)';

describe('layer boundaries', () => {
  it('accepts a pure domain file', () => {
    expect(lintErrors('domain/valid-entity.ts')).toEqual([]);
  });

  it('rejects nest in the domain', () => {
    expect(lintErrors('domain/imports-nest.ts')).toEqual([boundaryError]);
  });

  it('rejects infrastructure imported by the domain', () => {
    expect(lintErrors('domain/imports-infrastructure.ts')).toEqual([
      boundaryError,
    ]);
  });

  it('allows only node:crypto among the node builtins in the domain', () => {
    expect(lintErrors('domain/imports-node-crypto.ts')).toEqual([]);
    expect(lintErrors('domain/imports-node-fs.ts')).toEqual([boundaryError]);
  });

  it('allows the interface layer to import its own domain errors', () => {
    expect(lintErrors('interface/imports-domain-error.ts')).toEqual([]);
    expect(lintErrors('interface/imports-domain-entity.ts')).toEqual([
      boundaryError,
    ]);
  });

  it('rejects drizzle in the application layer', () => {
    expect(lintErrors('application/imports-drizzle.ts')).toEqual([
      boundaryError,
    ]);
  });

  it('allows only Injectable from @nestjs/common in the application layer', () => {
    expect(lintErrors('application/imports-injectable.ts')).toEqual([]);
    expect(lintErrors('application/imports-controller.ts')).toEqual([
      boundaryError,
    ]);
  });
});
