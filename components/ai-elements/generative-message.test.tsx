import { describe, expect, it } from 'vitest';

import { parseMessageContent } from './generative-message';

const validA2UI = JSON.stringify({
  surfaceUpdate: {
    components: [
      {
        id: 'stats-1',
        component: {
          StatsDisplay: {
            id: 'stats',
            stats: [{ key: 'users', label: 'Users', value: 42 }],
          },
        },
      },
    ],
  },
});

describe('parseMessageContent', () => {
  it('parses multiline and same-line JSX fences', () => {
    expect(parseMessageContent('```tsx\n<Card>hello</Card>\n```')[0]).toMatchObject({
      type: 'jsx',
      code: '<Card>hello</Card>',
    });

    expect(parseMessageContent('```jsx <Badge>new</Badge>```')[0]).toMatchObject({
      type: 'jsx',
      code: '<Badge>new</Badge>',
    });
  });

  it('preserves meaningful whitespace inside JSX', () => {
    const [block] = parseMessageContent(
      '```tsx\n<pre>{`first\\n  second`}</pre>\n```',
    );

    expect(block).toMatchObject({
      type: 'jsx',
      code: '<pre>{`first\\n  second`}</pre>',
    });
  });

  it('parses labelled, same-line, CRLF, and unlabelled A2UI fences', () => {
    const inputs = [
      `\`\`\`json\n${validA2UI}\n\`\`\``,
      `\`\`\`json ${validA2UI}\`\`\``,
      `\`\`\`json\r\n${validA2UI}\r\n\`\`\``,
      `\`\`\`\n${validA2UI}\n\`\`\``,
    ];

    for (const input of inputs) {
      expect(parseMessageContent(input)[0]).toMatchObject({
        type: 'a2ui',
        spec: { surfaceUpdate: { components: expect.any(Array) } },
      });
    }
  });

  it('keeps malformed JSON and invalid A2UI envelopes visible as text', () => {
    const malformed = parseMessageContent(
      '```json\n{"surfaceUpdate":{"components":[]},}\n```',
    );
    const invalidEnvelope = parseMessageContent(
      '```json\n{"surfaceUpdate":{"components":[{"id":"missing-component"}]}}\n```',
    );

    expect(malformed).toEqual([
      expect.objectContaining({ type: 'text' }),
    ]);
    expect(invalidEnvelope).toEqual([
      expect.objectContaining({ type: 'text' }),
    ]);
  });
});
