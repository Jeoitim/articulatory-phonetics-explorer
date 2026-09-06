import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { consonants } from '../data/consonants';
type Registry = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function useExplorerTool(select: (symbol: string) => void) {
  const action = useRef(select);
  useEffect(() => {
    action.current = select;
  }, [select]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: Registry })
      .modelContext;
    if (!context) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'explore_ipa_consonant',
            description:
              'Select a supported IPA consonant and display its articulation in Explore mode.',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  enum: consonants.map((s) => s.symbol),
                },
              },
              required: ['symbol'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute(input) {
              if (
                !input ||
                typeof input !== 'object' ||
                !('symbol' in input) ||
                typeof input.symbol !== 'string' ||
                !consonants.some((s) => s.symbol === input.symbol)
              )
                throw new Error('Choose a supported IPA consonant.');
              const symbol = input.symbol;
              flushSync(() => action.current(symbol));
              return { symbol, mode: 'explore' };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, []);
}
