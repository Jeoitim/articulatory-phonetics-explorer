import { useEffect, useRef, useState, useCallback } from 'react';
import type { AudioExample } from '../domain/phonetics';
export function useAudio() {
  const [manifest, setManifest] = useState<Record<string, AudioExample>>({});
  const [status, setStatus] = useState('');
  const player = useRef<HTMLAudioElement | null>(null);
  const request = useRef(0);
  const release=useCallback(()=>{request.current++;player.current?.pause();},[]);
  useEffect(() => {
    let active = true;
    fetch('/audio/manifest.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        if (active) setManifest(data);
      })
      .catch(() => {});
    return () => {
      active = false;
      release();
    };
  }, [release]);
  function stop() {
    request.current++;
    player.current?.pause();
    setStatus('');
  }
  async function play(symbol: string) {
    stop();
    const item = manifest[symbol];
    if (!item) {
      setStatus('该示例录音暂不可用，请查看来源页面。');
      return;
    }
    const token = request.current;
    const audio = new Audio(item.audioUrl);
    player.current = audio;
    setStatus('正在加载示例发音…');
    audio.onended = () => {
      if (request.current === token) setStatus('示例发音结束 · 可再次播放');
    };
    audio.onerror = () => {
      if (request.current === token)
        setStatus('录音加载失败，请重试或查看来源。');
    };
    try {
      await audio.play();
      if (request.current === token)
        setStatus('正在播放示例发音 · 含语音上下文');
    } catch {
      if (request.current === token) setStatus('无法播放，请点击重试。');
    }
  }
  return { play, stop, status, manifest };
}
