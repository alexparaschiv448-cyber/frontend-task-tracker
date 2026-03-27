// VideoPlayer.jsx
import { useRef, useEffect } from 'react';

export default function VideoPlayer({ src, isPlaying  }) {
    const ref = useRef(null);
    useEffect(() => {
        if (isPlaying) {
            ref.current.play();
        } else {
            ref.current.pause();
        }
    }, [isPlaying]);

    return <video ref={ref} src={src} loop playsInline />;
}