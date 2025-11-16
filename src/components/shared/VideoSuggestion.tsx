import { YouTubeVideoSuggestion } from '@/types';
import { Youtube } from 'lucide-react';
import styles from './VideoSuggestion.module.css';

interface VideoSuggestionProps {
  video: YouTubeVideoSuggestion;
}

const VideoSuggestion = ({ video }: VideoSuggestionProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Youtube className={styles.icon} />
        <h4 className={styles.title}>Video for You!</h4>
      </div>

      <div className={styles.videoWrapper}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${video.video_id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className={styles.info}>
        <h5 className={styles.videoTitle}>
          {video.title}
        </h5>
        <p className={styles.channelTitle}>
          {video.channel_title}
        </p>
      </div>
    </div>
  );
};

export default VideoSuggestion;
