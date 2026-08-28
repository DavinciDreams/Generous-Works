import { describe, expect, it } from 'vitest';
import type { SurfaceUpdate } from '@/lib/a2ui/types';

import {
  GalaxySurfaceContractError,
  deriveGalaxySurfaceTitle,
  toGalaxySurfaceSpec,
} from './galaxy-surface';

const researchBoard = (): { surfaceUpdate: SurfaceUpdate } => ({
  surfaceUpdate: {
    surfaceId: 'research-board',
    components: [
      {
        id: 'board-title',
        component: { Title: { text: 'Research Board' } },
      },
      {
        id: 'experiment-table',
        component: {
          DataTable: {
            data: {
              title: 'Experiments',
              columns: [{ id: 'title', header: 'Experiment', accessorKey: 'title' }],
              rows: [{ title: 'Parser reliability' }],
            },
          },
        },
      },
    ],
  },
});

describe('Galaxy surface contract', () => {
  it('converts the bounded Research Board fixture', () => {
    const message = researchBoard();
    const spec = toGalaxySurfaceSpec(message);

    expect(spec.schema).toBe('gb.surface.v1');
    expect(spec.catalog).toEqual({ id: 'generous.a2ui', version: '1' });
    expect(spec.bindings).toEqual([]);
    expect(deriveGalaxySurfaceTitle(message)).toBe('Research Board');
  });

  it('rejects arbitrary JSX components and action props', () => {
    const jsx = researchBoard();
    jsx.surfaceUpdate.components[0].component = { JSX: { code: '<Card />' } };
    expect(() => toGalaxySurfaceSpec(jsx)).toThrow(GalaxySurfaceContractError);

    const action = researchBoard();
    action.surfaceUpdate.components[0].component = {
      Card: { onClick: 'deleteEverything' },
    };
    expect(() => toGalaxySurfaceSpec(action)).toThrow(/not allowed/);
  });

  it('rejects stale references, cycles, and non-finite data', () => {
    const missing = researchBoard();
    missing.surfaceUpdate.components[0].children = ['missing'];
    expect(() => toGalaxySurfaceSpec(missing)).toThrow(/unknown child/);

    const cycle = researchBoard();
    cycle.surfaceUpdate.components[0].children = ['experiment-table'];
    cycle.surfaceUpdate.components[1].children = ['board-title'];
    expect(() => toGalaxySurfaceSpec(cycle)).toThrow(/cycle/);

    const invalidNumber = researchBoard();
    invalidNumber.surfaceUpdate.components[0].component = { Card: { score: Infinity } };
    expect(() => toGalaxySurfaceSpec(invalidNumber)).toThrow(/non-finite/);
  });
});
