import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SVGPreview, SVGPreviewContent, svgImageSource } from './svg-preview';

// Each of these would run code in this origin, or restyle the page, if the
// markup were inserted into the document.
const HOSTILE = `<svg viewBox="0 0 100 100" onload="window.__svgPwned='root'">
  <image href="x" onerror="window.__svgPwned='image'"/>
  <foreignObject width="50" height="50"><img xmlns="http://www.w3.org/1999/xhtml" src="x" onerror="window.__svgPwned='foreign'"/></foreignObject>
  <style>body { display: none }</style>
  <rect width="10" height="10" onclick="window.__svgPwned='click'"/>
</svg>`;

const decoded = (source: string) =>
  decodeURIComponent(source.replace(/^data:image\/svg\+xml;charset=utf-8,/, ''));

describe('SVGPreviewContent', () => {
  it('never puts SVG markup into the page', () => {
    const { container } = render(
      <SVGPreview svg={HOSTILE} title="Hostile">
        <SVGPreviewContent />
      </SVGPreview>,
    );

    for (const tag of ['svg', 'image', 'foreignObject', 'style', 'rect']) {
      expect(container.querySelector(tag), tag).toBeNull();
    }
    const handlers = [...container.querySelectorAll('*')].flatMap((element) =>
      [...element.attributes].filter((attribute) => /^on/i.test(attribute.name)),
    );
    expect(handlers).toEqual([]);

    const image = container.querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('alt')).toBe('Hostile');
    expect(image?.getAttribute('src')).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
    expect((window as { __svgPwned?: string }).__svgPwned).toBeUndefined();
  });

  it('sandboxes the isolated frame so its content gets no origin', () => {
    const { container } = render(
      <SVGPreview svg={HOSTILE}>
        <SVGPreviewContent isolate />
      </SVGPreview>,
    );
    const frame = container.querySelector('iframe');
    expect(frame?.getAttribute('sandbox')).toBe('');
  });
});

describe('svgImageSource', () => {
  it('declares the SVG namespace an image needs, once', () => {
    expect(decoded(svgImageSource('<svg width="10"><circle r="4"/></svg>'))).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="10"><circle r="4"/></svg>',
    );
    const declared = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="4"/></svg>';
    expect(decoded(svgImageSource(declared))).toBe(declared);
  });

  it('declares xlink when the drawing uses it', () => {
    const source = decoded(svgImageSource('<svg><use xlink:href="#a"/></svg>'));
    expect(source).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
    expect(source).toContain('xmlns="http://www.w3.org/2000/svg"');
  });
});
