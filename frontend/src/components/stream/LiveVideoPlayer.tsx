import Hls from "hls.js";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  FiAlertTriangle,
  FiRadio,
  FiRefreshCw,
  FiWifi,
  FiWifiOff,
} from "react-icons/fi";

export type StreamStatus = "programado" | "en_vivo" | "finalizado";
export type SignalStatus = "sin_senal" | "conectado" | "desconectado" | "error";

type LiveVideoPlayerProps = {
  playbackUrl?: string | null;
  poster?: string;
  title?: string;
  streamStatus: StreamStatus;
  signalStatus?: SignalStatus;
};

export default function LiveVideoPlayer({
  playbackUrl,
  poster,
  title = "Directo en vivo",
  streamStatus,
  signalStatus = "sin_senal",
}: LiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const resumeTimerRef = useRef<number | null>(null);
  const bufferingTimerRef = useRef<number | null>(null);

  const userMutedRef = useRef(true);
  const userVolumeRef = useRef(1);

  const [playerError, setPlayerError] = useState<{
    source: string;
    message: string;
  } | null>(null);

  const [showBuffering, setShowBuffering] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const canPlayLive =
    Boolean(playbackUrl) &&
    streamStatus === "en_vivo" &&
    signalStatus === "conectado";

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const clearBufferingTimer = useCallback(() => {
    if (bufferingTimerRef.current) {
      window.clearTimeout(bufferingTimerRef.current);
      bufferingTimerRef.current = null;
    }
  }, []);

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const safePlay = useCallback(async () => {
    const video = videoRef.current;

    if (!video || !canPlayLive) return;

    try {
      video.playsInline = true;

      // Respeta lo que el usuario eligió.
      video.muted = userMutedRef.current;
      video.volume = userVolumeRef.current;

      await video.play();
    } catch (error) {
      // Si el navegador bloquea autoplay con sonido, intenta en silencio una sola vez.
      try {
        video.muted = true;
        userMutedRef.current = true;
        await video.play();
      } catch {
        console.warn("LIVE_PLAYER_PLAY_BLOCKED", error);
      }
    }
  }, [canPlayLive]);

  const scheduleResume = useCallback(() => {
    clearResumeTimer();

    resumeTimerRef.current = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        safePlay();
      }
    }, 900);
  }, [clearResumeTimer, safePlay]);

  const startSoftBuffering = useCallback(() => {
    clearBufferingTimer();

    bufferingTimerRef.current = window.setTimeout(() => {
      setShowBuffering(true);
    }, 3500);
  }, [clearBufferingTimer]);

  const stopBuffering = useCallback(() => {
    clearBufferingTimer();
    setShowBuffering(false);
  }, [clearBufferingTimer]);

  const reloadPlayer = useCallback(() => {
    setPlayerError(null);
    setShowBuffering(false);
    setRetryKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    let active = true;

    destroyHls();
    clearResumeTimer();
    clearBufferingTimer();

    queueMicrotask(() => {
      if (!active) return;
      setPlayerError(null);
      setShowBuffering(false);
    });

    if (!video || !playbackUrl || streamStatus !== "en_vivo") {
      return () => {
        active = false;
      };
    }

    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";

    // Para que Chrome permita autoplay, arrancamos silenciado.
    // Si el usuario luego activa sonido, lo respetamos.
    video.muted = userMutedRef.current;
    video.volume = userVolumeRef.current;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playbackUrl;
      safePlay();

      return () => {
        active = false;
        clearResumeTimer();
        clearBufferingTimer();
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }

    if (!Hls.isSupported()) {
      queueMicrotask(() => {
        if (!active) return;
        setPlayerError({
          source: playbackUrl,
          message: "Tu navegador no soporta HLS en este entorno.",
        });
      });

      return () => {
        active = false;
      };
    }

    const hls = new Hls({
      lowLatencyMode: false,
      backBufferLength: 60,
      liveSyncDurationCount: 3,
      liveMaxLatencyDurationCount: 8,
      maxBufferLength: 30,
      maxBufferSize: 80 * 1000 * 1000,
      enableWorker: true,
    });

    hlsRef.current = hls;

    hls.loadSource(playbackUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      stopBuffering();
      safePlay();
    });

    hls.on(Hls.Events.LEVEL_LOADED, () => {
      stopBuffering();
    });

    hls.on(Hls.Events.FRAG_BUFFERED, () => {
      stopBuffering();
    });

    hls.on(Hls.Events.ERROR, (_event, data) => {
      console.error("HLS_PLAYER_ERROR", data);

      if (!data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        startSoftBuffering();
        hls.startLoad();
        scheduleResume();
        return;
      }

      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        startSoftBuffering();
        hls.recoverMediaError();
        scheduleResume();
        return;
      }

      setPlayerError({
        source: playbackUrl,
        message: "No se pudo reproducir el HLS del directo.",
      });
    });

    return () => {
      active = false;
      clearResumeTimer();
      clearBufferingTimer();
      destroyHls();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [
    playbackUrl,
    streamStatus,
    retryKey,
    destroyHls,
    clearResumeTimer,
    clearBufferingTimer,
    safePlay,
    scheduleResume,
    startSoftBuffering,
    stopBuffering,
  ]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return undefined;

    function rememberAudioState() {
      const currentVideo = videoRef.current;

      if (!currentVideo) return;

      userMutedRef.current = currentVideo.muted;
      userVolumeRef.current = currentVideo.volume;
    }

    function handlePlay() {
      stopBuffering();
    }

    function handlePlaying() {
      stopBuffering();
    }

    function handleWaiting() {
      if (canPlayLive) {
        startSoftBuffering();
      }
    }

    function handlePause() {
      if (canPlayLive && document.visibilityState === "visible") {
        scheduleResume();
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        scheduleResume();
      }
    }

    function handleFocus() {
      scheduleResume();
    }

    function handleFullscreenChange() {
      scheduleResume();
    }

    video.addEventListener("volumechange", rememberAudioState);
    video.addEventListener("play", handlePlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("canplay", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("stalled", handleWaiting);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("volumechange", rememberAudioState);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("canplay", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("stalled", handleWaiting);

      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [canPlayLive, scheduleResume, startSoftBuffering, stopBuffering]);

  const waitingForSignal =
    streamStatus === "en_vivo" && signalStatus !== "conectado";

  const currentError =
    playerError && playerError.source === playbackUrl ? playerError.message : "";

  return (
    <PlayerFrame>
      <video
        ref={videoRef}
        poster={poster}
        title={title}
        controls
        muted
        autoPlay
        playsInline
      />

      {streamStatus === "programado" && (
        <PlayerOverlay>
          <FiRadio />
          <strong>Stream programado</strong>
          <span>El directo aún no fue iniciado.</span>
        </PlayerOverlay>
      )}

      {streamStatus === "finalizado" && (
        <PlayerOverlay>
          <FiWifiOff />
          <strong>Stream finalizado</strong>
          <span>Esta transmisión ya terminó.</span>
        </PlayerOverlay>
      )}

      {waitingForSignal && (
        <PlayerOverlay>
          <FiRadio />
          <strong>Esperando señal del streamer</strong>
          <span>
            Configura OBS con la clave de transmisión y empieza a emitir.
          </span>
        </PlayerOverlay>
      )}

      {currentError && (
        <PlayerOverlay $danger>
          <FiAlertTriangle />
          <strong>Error de reproducción</strong>
          <span>{currentError}</span>

          <OverlayButton type="button" onClick={reloadPlayer}>
            <FiRefreshCw /> Reintentar
          </OverlayButton>
        </PlayerOverlay>
      )}

      {canPlayLive && !currentError && !waitingForSignal && (
        <LiveBadge>
          <FiWifi />
          EN VIVO
        </LiveBadge>
      )}

      {showBuffering && canPlayLive && !currentError && !waitingForSignal && (
        <BufferBadge>
          <FiRefreshCw />
          Ajustando señal...
        </BufferBadge>
      )}
    </PlayerFrame>
  );
}

const PlayerFrame = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 320px;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  background: #020617;
  border: 1px solid rgba(0, 229, 255, 0.18);

  video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    background: #020617;
  }
`;

const PlayerOverlay = styled.div<{ $danger?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
  color: ${({ $danger }) => ($danger ? "#fecdd3" : "#e8fbff")};
  background: rgba(2, 6, 23, 0.72);
  pointer-events: auto;

  svg {
    width: 34px;
    height: 34px;
    color: ${({ $danger }) => ($danger ? "#fb7185" : "#00e5ff")};
  }

  strong {
    font-size: 20px;
  }

  span {
    max-width: 520px;
    color: rgba(226, 232, 240, 0.72);
    line-height: 1.5;
  }
`;

const OverlayButton = styled.button`
  border: 1px solid rgba(0, 229, 255, 0.55);
  background: linear-gradient(135deg, #00e5ff, #22c55e);
  color: #031018;
  border-radius: 12px;
  padding: 10px 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 950;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
    color: currentColor;
  }
`;

const LiveBadge = styled.div`
  position: absolute;
  left: 14px;
  top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  padding: 8px 11px;
  background: rgba(244, 63, 94, 0.92);
  color: #fff;
  font-size: 12px;
  font-weight: 950;
  pointer-events: none;
  z-index: 3;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const BufferBadge = styled.div`
  position: absolute;
  right: 14px;
  top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  padding: 8px 11px;
  background: rgba(15, 23, 42, 0.88);
  color: #e8fbff;
  border: 1px solid rgba(0, 229, 255, 0.25);
  font-size: 12px;
  font-weight: 900;
  pointer-events: none;
  z-index: 3;

  svg {
    width: 14px;
    height: 14px;
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
