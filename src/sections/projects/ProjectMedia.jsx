import { useEffect, useRef, useState } from "react";

/* Video propio: sin controles, en silencio (requisito de los navegadores para arrancar solo) y en bucle.
   Se reproduce mientras `playing` es true y se pausa al salir; al volver retoma desde donde quedo. */
function FileVideo({ src, poster, title, playing }) {
    const videoRef = useRef(null);

    /* Reproduce o pausa segun el proyecto este en pantalla; play() puede rechazarse si el navegador lo bloquea. */
    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        if (playing) {
            video.muted = true;
            video.play()?.catch(() => {});
        } else {
            video.pause();
        }
    }, [playing]);

    return (
        <video
            ref={videoRef}
            className="prj-frame-fill"
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            disablePictureInPicture
            preload={playing ? "auto" : "none"}
            aria-label={title}
        />
    );
}

/* Video de YouTube con el mismo comportamiento: se carga la primera vez que el proyecto aparece y despues se
   pausa/reanuda con la API de mensajes del reproductor (sin controles, en silencio y en bucle). */
function YouTubeVideo({ id, poster, title, playing }) {
    const frameRef = useRef(null);
    const [loaded, setLoaded] = useState(playing);
    const [ready, setReady] = useState(false);

    /* Monta el iframe recien la primera vez que hay que reproducir. */
    if (playing && !loaded) {
        setLoaded(true);
    }

    /* Envia play/pause al reproductor cuando cambia el estado. */
    useEffect(() => {
        const target = frameRef.current?.contentWindow;
        if (!ready || !target) {
            return;
        }
        const message = { event: "command", func: playing ? "playVideo" : "pauseVideo", args: [] };
        target.postMessage(JSON.stringify(message), "https://www.youtube-nocookie.com");
    }, [playing, ready]);

    if (!loaded) {
        return poster ? <img className="prj-frame-fill" src={poster} alt="" loading="lazy" /> : null;
    }

    const params = `autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
    return (
        <iframe
            ref={frameRef}
            className="prj-frame-fill prj-frame-locked"
            src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
            onLoad={() => setReady(true)}
        />
    );
}

/* Fotos en mosaico; con cantidad impar la primera ocupa todo el ancho. */
function Mosaic({ images, title }) {
    return (
        <div className="prj-mosaic" data-odd={images.length % 2 === 1 || undefined}>
            {images.map((src, index) => (
                <a key={src} className="prj-mosaic-item" href={src} target="_blank" rel="noreferrer">
                    <img src={src} alt={`${title} (${index + 1}/${images.length})`} loading="lazy" />
                </a>
            ))}
        </div>
    );
}

/* Medio principal de un proyecto: video (propio o YouTube) con fotos extra en mosaico debajo,
   o solo fotos (una sola imagen o mosaico si son varias). */
export default function ProjectMedia({ project, title, playing }) {
    const { video, poster } = project;
    const images = project.images ?? [];

    if (!video) {
        const photos = images.length > 0 ? images : [poster].filter(Boolean);
        if (photos.length > 1) {
            return <Mosaic images={photos} title={title} />;
        }
        return (
            <div className="prj-frame">
                <img className="prj-frame-fill" src={photos[0]} alt={title} loading="lazy" />
            </div>
        );
    }

    return (
        <>
            <div className="prj-frame">
                {video.type === "youtube" ? (
                    <YouTubeVideo id={video.id} poster={poster} title={title} playing={playing} />
                ) : (
                    <FileVideo src={video.src} poster={poster} title={title} playing={playing} />
                )}
            </div>
            {images.length > 0 && <Mosaic images={images} title={title} />}
        </>
    );
}
