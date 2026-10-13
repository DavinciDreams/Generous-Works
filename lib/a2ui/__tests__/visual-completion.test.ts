import { describe, expect, it } from 'vitest';

import type { A2UIMessage } from '../types';
import {
  assessA2UIVisualCompletion,
  getA2UIRenderFormat,
  getCompleteA2UIVisualRetryPrompt,
  isVisualRequest,
} from '../visual-completion';

function surface(type: string, props: Record<string, unknown> = {}): A2UIMessage[] {
  return [{
    surfaceUpdate: {
      surfaceId: 'main',
      components: [{ id: 'root', component: { [type]: props } }],
    },
    beginRendering: true,
  }];
}

describe('A2UI visual completion', () => {
  it('detects requests that promise a visual result', () => {
    expect(isVisualRequest('Can you make a spinor visualization?')).toBe(true);
    expect(isVisualRequest('Build a Sankey for this flow')).toBe(true);
    expect(isVisualRequest('Explain spinors in plain language')).toBe(false);
  });

  it('rejects a title-only surface for a visual request', () => {
    expect(
      assessA2UIVisualCompletion('Make a spinor visualization', surface('Text')),
    ).toEqual({ complete: false, componentTypes: ['Text'] });
  });

  it('accepts a specialized visual component', () => {
    expect(
      assessA2UIVisualCompletion(
        'Make a spinor visualization',
        surface('ThreeScene', { data: { objects: [] } }),
      ),
    ).toEqual({ complete: true, componentTypes: ['ThreeScene'] });
  });

  it('rejects a specialized component with invalid props', () => {
    expect(
      assessA2UIVisualCompletion('Make a spinor visualization', surface('ThreeScene')),
    ).toEqual({ complete: false, componentTypes: ['ThreeScene'] });
  });

  it('does not impose visual component requirements on prose prompts', () => {
    expect(
      assessA2UIVisualCompletion('Explain spinors', surface('Text')),
    ).toEqual({ complete: true, componentTypes: ['Text'] });
  });

  it('routes visual prompts through the complete A2UI response path', () => {
    expect(getA2UIRenderFormat('Build a knowledge graph')).toBeUndefined();
    expect(getA2UIRenderFormat('Explain quantum mechanics')).toBe('a2ui-jsonl');
  });

  it('produces a bounded complete-response corrective instruction', () => {
    const retry = getCompleteA2UIVisualRetryPrompt('Make a chart');
    expect(retry).toContain('Make a chart');
    expect(retry).toContain('complete A2UI surface');
    expect(retry).toContain('not JSONL');
    expect(retry).toContain('not just a title or prose');
  });
});
