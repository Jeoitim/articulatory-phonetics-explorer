/** Keep a base symbol and its combining mark in one text run. */
export function IPAToken({ symbol, mark }: { symbol: string; mark?: string }) {
  return (
    <span className="ipa-token" key={`${symbol}:${mark ?? ''}`}>
      {symbol + (mark ?? '')}
    </span>
  );
}
