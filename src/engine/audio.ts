import { useEffect, useRef, useState, useCallback } from 'react';
import type { AudioExample } from '../domain/phonetics';

const audioTimeout = 8000;

/** 在根路径和 GitHub Pages 项目子路径下解析公共资源。 */
export function resolveAudioUrl(path: string, base?: string) {
  if (/^[a-z][a-z\d+.-]*:/i.test(path)) return path;
  const baseUrl = new URL(
    base ??
      (typeof document === 'undefined'
        ? 'http://localhost/'
        : document.baseURI),
  );
  // 一些静态托管允许不带末尾斜杠直接访问。
  // 将它视为站点目录，避免 `/audio/*` 路径逃逸到项目之外。
  if (!baseUrl.pathname.endsWith('/')) {
    const lastSegment = baseUrl.pathname.slice(
      baseUrl.pathname.lastIndexOf('/') + 1,
    );
    baseUrl.pathname = lastSegment.includes('.')
      ? baseUrl.pathname.slice(0, baseUrl.pathname.lastIndexOf('/') + 1)
      : baseUrl.pathname + '/';
  }
  return new URL(path.replace(/^\/+/, ''), baseUrl).toString();
}

/** 将 Commons 文件页面转换为稳定的在线媒体跳转地址。 */
export function onlineAudioUrl(source: string) {
  try {
    const page = new URL(source);
    if (page.hostname !== 'commons.wikimedia.org') return null;
    const pathname = decodeURIComponent(page.pathname);
    const marker = '/wiki/File:';
    const start = pathname.indexOf(marker);
    if (start < 0) return null;
    const filename = pathname.slice(start + marker.length);
    if (!filename) return null;
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
  } catch {
    return null;
  }
}

export function useAudio(initialManifest: Record<string, AudioExample> = {}) {
  const [manifest, setManifest] =
    useState<Record<string, AudioExample>>(initialManifest);
  const [status, setStatus] = useState('');
  const player = useRef<HTMLAudioElement | null>(null);
  const request = useRef(0);
  const release = useCallback(() => {
    request.current++;
    player.current?.pause();
  }, []);
  useEffect(() => {
    let active = true;
    fetch(resolveAudioUrl('/audio/manifest.json'))
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        if (active) setManifest((current) => ({ ...current, ...data }));
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
    const localUrl = resolveAudioUrl(item.audioUrl);
    const onlineUrl = onlineAudioUrl(item.source);
    const sources = [localUrl, onlineUrl].filter(
      (url, index, all): url is string =>
        Boolean(url) && all.indexOf(url) === index,
    );
    setStatus(sources.length > 1 ? '正在加载本地录音…' : '正在加载示例发音…');

    for (const [index, url] of sources.entries()) {
      if (request.current !== token) return;
      try {
        const audio = await new Promise<HTMLAudioElement>((resolve, reject) => {
          const candidate = new Audio();
          let settled = false;
          function finish(error?: Error) {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            if (error) {
              candidate.pause();
              reject(error);
            } else resolve(candidate);
          }
          const timer = setTimeout(
            () => finish(new Error('audio-timeout')),
            audioTimeout,
          );
          candidate.preload = 'auto';
          candidate.onerror = () => finish(new Error('audio-error'));
          candidate.src = url;
          player.current = candidate;
          void candidate
            .play()
            .then(() => finish())
            .catch(() => finish(new Error('audio-playback')));
        });
        if (request.current !== token) {
          audio.pause();
          return;
        }
        audio.onended = () => {
          if (request.current === token) setStatus('示例发音结束 · 可再次播放');
        };
        setStatus(
          index === 0
            ? '正在播放示例发音 · 含语音上下文'
            : '在线备用录音播放中 · Wikimedia Commons',
        );
        return;
      } catch {
        if (request.current !== token) return;
        if (index + 1 < sources.length)
          setStatus('本地录音不可用，正在尝试在线备用…');
      }
    }
    if (request.current === token)
      setStatus(
        sources.length > 1
          ? '本地录音不可用，在线备用也未能播放；可打开来源页面。'
          : '录音加载失败，请重试或查看来源。',
      );
  }
  return { play, stop, status, manifest };
}
