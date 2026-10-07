import { describe, expect, it } from 'vitest';
import type { SurfaceUpdate } from '@/lib/a2ui/types';

import {
  GalaxySurfaceContractError,
  deriveGalaxySurfaceTitle,
  galaxySurfaceToMessageContent,
  toReplayableA2UIMessage,
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

  it('rejects prototype-pollution keys at any property depth', () => {
    const polluted = researchBoard();
    polluted.surfaceUpdate.components[0].component = {
      Markdown: JSON.parse('{"data":{"__proto__":{"polluted":true}}}'),
    };
    expect(() => toGalaxySurfaceSpec(polluted)).toThrow(/not allowed/);

    const constructor = researchBoard();
    constructor.surfaceUpdate.components[0].component = {
      Markdown: { data: { constructor: { prototype: { polluted: true } } } },
    };
    expect(() => toGalaxySurfaceSpec(constructor)).toThrow(/not allowed/);
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
    invalidNumber.surfaceUpdate.components[0].component = { Charts: { data: { score: Infinity } } };
    expect(() => toGalaxySurfaceSpec(invalidNumber)).toThrow(/non-finite/);
  });

  const CIRCLE = '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>';
  const withSvg = (props: Record<string, unknown>) => {
    const message = researchBoard();
    message.surfaceUpdate.components.push({ id: 'contour', component: { SVGPreview: props } });
    return message;
  };
  const svgPropsIn = (spec: { surfaceUpdate?: { components: { id: string; component: unknown }[] } }) =>
    spec.surfaceUpdate?.components.find((component) => component.id === 'contour')?.component;

  it('promotes SVG diagrams with the props Galaxy accepts', () => {
    const message = withSvg({ svg: CIRCLE, title: 'Contour', filename: 'contour.svg', width: 480, height: '320px' });
    const before = structuredClone(message);

    expect(svgPropsIn(toGalaxySurfaceSpec(message))).toEqual({
      SVGPreview: { svg: CIRCLE, title: 'Contour', filename: 'contour.svg', width: 480, height: '320px' },
    });
    expect(message).toEqual(before);
  });

  it('drops cosmetic SVG props Galaxy would refuse instead of failing the save', () => {
    const spec = toGalaxySurfaceSpec(withSvg({
      svg: CIRCLE,
      width: 'auto',
      height: '100vw',
      showSource: true,
      title: 'x'.repeat(501),
    }));
    expect(svgPropsIn(spec)).toEqual({ SVGPreview: { svg: CIRCLE } });
  });

  it('refuses a drawing Galaxy would refuse, saying why', () => {
    const refusals: [string, RegExp][] = [
      ['<!DOCTYPE svg [<!ENTITY a "aaaa">]><svg>&a;</svg>', /DOCTYPE or entities/],
      ['<html><svg></svg></html>', /single SVG document/],
      ['   ', /non-empty SVG document/],
      [`<svg>${'x'.repeat(20_000)}</svg>`, /is 20,011 characters; Galaxy accepts SVG up to 20,000/],
    ];
    for (const [svg, reason] of refusals) {
      expect(() => toGalaxySurfaceSpec(withSvg({ svg })), svg.slice(0, 20)).toThrow(reason);
    }
  });

  it('does not let a prop that is left behind block the save', () => {
    const spec = toGalaxySurfaceSpec(withSvg({ svg: CIRCLE, title: 'javascript: a primer'.padEnd(600, '.') }));
    expect(svgPropsIn(spec)).toEqual({ SVGPreview: { svg: CIRCLE } });
  });

  it('agrees with Galaxy on what an SVG document is', () => {
    expect(() => toGalaxySurfaceSpec(withSvg({ svg: '<?XML version="1.0"?><svg/>' }))).toThrow(
      /single SVG document/,
    );
    const commented = `<!-- a -- b -->\n<!---->\n${CIRCLE}`;
    expect(svgPropsIn(toGalaxySurfaceSpec(withSvg({ svg: commented })))).toEqual({
      SVGPreview: { svg: commented },
    });
    // Galaxy counts code points: 19,989 emoji are 39,978 UTF-16 units.
    const wide = `<svg>${'😀'.repeat(19_989)}</svg>`;
    expect(svgPropsIn(toGalaxySurfaceSpec(withSvg({ svg: wide })))).toEqual({ SVGPreview: { svg: wide } });
    expect(() => toGalaxySurfaceSpec(withSvg({ svg: `<svg>${'😀'.repeat(19_990)}</svg>` }))).toThrow(
      /is 20,001 characters/,
    );
    const emojiTitle = '🧪'.repeat(500);
    expect(svgPropsIn(toGalaxySurfaceSpec(withSvg({ svg: CIRCLE, title: emojiTitle })))).toEqual({
      SVGPreview: { svg: CIRCLE, title: emojiTitle },
    });
  });

  it('checks stacked comments in linear time', () => {
    for (const svg of ['<!---->'.repeat(2_800) + 'x', `<!--${'-'.repeat(19_000)}`, '<!--<!--'.repeat(2_400) + 'x']) {
      const started = performance.now();
      expect(() => toGalaxySurfaceSpec(withSvg({ svg }))).toThrow(GalaxySurfaceContractError);
      expect(performance.now() - started).toBeLessThan(250);
    }
  });

  it('leaves behind props Galaxy does not take, on every component', () => {
    const message = researchBoard();
    message.surfaceUpdate.components[0].component = { Title: { text: 'Research Board', color: 'red' } };
    message.surfaceUpdate.components.push({ id: 'panel', component: { Card: { title: 'Panel', elevation: 2 } } });

    const components = toGalaxySurfaceSpec(message).surfaceUpdate.components;
    expect(components[0].component).toEqual({ Title: { text: 'Research Board' } });
    expect(components.find((component) => component.id === 'panel')?.component).toEqual({ Card: {} });
  });

  it('still refuses behaviour on a prop that would be left behind', () => {
    const message = researchBoard();
    message.surfaceUpdate.components[0].component = { Title: { text: 'x', onHover: 'steal()' } };
    expect(() => toGalaxySurfaceSpec(message)).toThrow(/onHover is not allowed/);
  });

  it('applies the same checks to a surface coming back from Galaxy', () => {
    const stored = toGalaxySurfaceSpec(withSvg({ svg: CIRCLE }));
    const tampered = structuredClone(stored);
    const svgComponent = tampered.surfaceUpdate.components.find((component) => component.id === 'contour');
    (svgComponent!.component as { SVGPreview: { svg: string } }).SVGPreview.svg =
      '<!DOCTYPE svg [<!ENTITY a "a">]><svg>&a;</svg>';

    expect(() => toReplayableA2UIMessage(tampered)).toThrow(/DOCTYPE or entities/);
    expect(svgPropsIn(toReplayableA2UIMessage(stored))).toEqual({ SVGPreview: { svg: CIRCLE } });
  });

  it('still refuses components Galaxy cannot draw', () => {
    const message = researchBoard();
    message.surfaceUpdate.components.push({
      id: 'scene',
      component: { ThreeScene: { data: {} } },
    });
    expect(() => toGalaxySurfaceSpec(message)).toThrow(/not approved for Galaxy Brain: ThreeScene/);
  });

  it('revalidates the schema, catalog, and components before replay', () => {
    const stored = toGalaxySurfaceSpec(researchBoard());
    expect(toReplayableA2UIMessage(stored)).toEqual({
      surfaceUpdate: stored.surfaceUpdate,
    });
    expect(galaxySurfaceToMessageContent(stored)).toContain('```json');

    expect(() => toReplayableA2UIMessage({ ...stored, schema: 'gb.surface.v0' })).toThrow(
      /unsupported schema or catalog/,
    );
    const unsafe = structuredClone(stored);
    unsafe.surfaceUpdate.components[0].component = { JSX: { code: '<Card />' } };
    expect(() => toReplayableA2UIMessage(unsafe)).toThrow(/not approved/);
  });
});
