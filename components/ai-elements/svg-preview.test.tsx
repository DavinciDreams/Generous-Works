import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SVGPreview, SVGPreviewContent, svgImage } from './svg-preview';

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

const markupOf = (svg: string, color?: string) => {
  const image = svgImage(svg, color);
  if (!image) throw new Error('no image');
  return decoded(image.src);
};

describe('svgImage', () => {
  it('declares the SVG namespace an image needs', () => {
    const markup = markupOf('<svg width="10"><circle r="4"/></svg>');
    expect(markup).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(markup.match(/xmlns=/g)).toHaveLength(1);
  });

  it('turns xlink:href into the href SVG 2 reads, needing no xlink namespace', () => {
    const markup = markupOf('<svg><use xlink:href="#a"/><use href="#b" xlink:href="#c"/></svg>');
    expect(markup).toContain('<use href="#a"/>');
    expect(markup).toContain('<use href="#b"/>');
    expect(markup).not.toContain('xlink');
  });

  it('reads HTML entities and loose markup the way inline SVG did', () => {
    const markup = markupOf('<svg viewBox="0 0 10 10"><text>90&deg; &times; 2</text><circle r=4></svg>');
    expect(markup).toContain('90° × 2');
    expect(markup).toContain('<circle r="4"');
  });

  it('is not fooled by a ">" in an attribute or an <svg in a comment', () => {
    const markup = markupOf('<!-- <svg width="1"> --><svg aria-label="a > b" width="40"><rect/></svg>');
    expect(markup).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" aria-label="a &gt; b" width="40">/);
  });

  it('drops editor metadata whose prefixes an image cannot bind', () => {
    const markup = markupOf(
      '<svg><sodipodi:namedview pagecolor="#fff"/><g inkscape:label="Layer 1"><rect/></g></svg>',
    );
    expect(markup).not.toMatch(/sodipodi|inkscape/);
    expect(markup).toContain('<rect');
  });

  it('gives currentColor the page colour unless the drawing sets its own', () => {
    expect(markupOf('<svg><path stroke="currentColor"/></svg>', 'rgb(1, 2, 3)')).toContain('color="rgb(1, 2, 3)"');
    expect(markupOf('<svg color="red"><path/></svg>', 'rgb(1, 2, 3)')).toContain('color="red"');
  });

  it('takes its size only from the root', () => {
    expect(svgImage('<svg viewBox="0 0 10 10"><rect height="2" stroke-width="3"/></svg>')?.sized).toBe(false);
    expect(svgImage('<svg width="200" viewBox="0 0 10 10"/>')?.sized).toBe(true);
  });

  it('refuses source without a drawing', () => {
    expect(svgImage('<p>no drawing</p>')).toBeNull();
  });
});

describe('SVGPreviewContent sizing', () => {
  const imageFor = (svg: string, size: { width?: string | number; height?: string | number } = {}) =>
    render(
      <SVGPreview svg={svg} {...size}>
        <SVGPreviewContent />
      </SVGPreview>,
    ).container.querySelector('img');

  it('never sizes from a child element or stroke width', () => {
    const image = imageFor('<svg viewBox="0 0 100 50"><rect height="2" stroke-width="3"/></svg>');
    expect(image?.getAttribute('width')).toBeNull();
    expect(image?.getAttribute('height')).toBeNull();
    expect(image?.classList.contains('w-full')).toBe(true);
  });

  it('lets a drawing with its own size keep it, within the frame', () => {
    const image = imageFor('<svg width="120" height="60"/>');
    expect(image?.getAttribute('width')).toBeNull();
    expect(image?.classList.contains('w-full')).toBe(false);
    expect(image?.classList.contains('max-w-full')).toBe(true);
  });

  it('applies pixel sizes as attributes, with no inline style', () => {
    const image = imageFor('<svg viewBox="0 0 1 1"/>', { width: '320px', height: 200 });
    expect(image?.getAttribute('width')).toBe('320');
    expect(image?.getAttribute('height')).toBe('200');
    expect(image?.getAttribute('style')).toBeNull();
  });
});
