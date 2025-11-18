import { YouTubeVideoSuggestion } from '@/types';
import { Youtube } from 'lucide-react';

interface VideoSuggestionProps {
  video: YouTubeVideoSuggestion;
}

const VideoSuggestion = ({ video }: VideoSuggestionProps) => {
  return (
    <div className="video-suggestion-card mt-4 animate-fade-in overflow-hidden rounded-xl shadow-sm border border-surface-tertiary bg-surface-secondary">
      <div className="video-header p-3 flex items-center gap-2 border-b border-surface-tertiary/50 bg-surface-tertiary/30">
        <Youtube className="h-5 w-5 text-red-500" />
        <h4 className="text-sm font-semibold text-text-primary">Video for You!</h4>
      </div>

      <div className="relative w-full aspect-video bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.video_id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="p-3 bg-surface-secondary">
        <h5 className="text-sm font-medium text-text-primary line-clamp-2 mb-1">
          {video.title}
        </h5>
        <p className="text-xs text-text-secondary">
          {video.channel_title}
        </p>
      </div>
    </div>
  );
};

export default VideoSuggestion;
