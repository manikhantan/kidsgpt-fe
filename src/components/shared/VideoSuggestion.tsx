import { YouTubeVideoSuggestion } from '@/types';
import { Play, Youtube } from 'lucide-react';
import { useState } from 'react';

interface VideoSuggestionProps {
  video: YouTubeVideoSuggestion;
}

const VideoSuggestion = ({ video }: VideoSuggestionProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open(video.url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="video-suggestion-card mt-4 animate-fade-in">
      <div className="video-header">
        <Youtube className="h-5 w-5 text-red-500" />
        <h4 className="text-sm font-semibold text-white">Video for You!</h4>
      </div>

      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="video-link w-full text-left"
        aria-label={`Watch video: ${video.title}`}
      >
        <div className="video-thumbnail-wrapper">
          {!imageError ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="video-thumbnail"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="video-thumbnail-placeholder">
              <Youtube className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className={`play-button-overlay ${isHovered ? 'opacity-100 scale-110' : 'opacity-90'}`}>
            <div className="play-button-circle">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        </div>

        <div className="video-info">
          <h5 className="video-title">{video.title}</h5>
          <p className="video-channel">{video.channel_title}</p>
        </div>
      </button>

      <div className="video-cta">
        <button
          onClick={handleClick}
          className="watch-button"
          aria-label="Watch video on YouTube"
        >
          <Play className="h-4 w-4" />
          <span>Watch Video</span>
        </button>
      </div>
    </div>
  );
};

export default VideoSuggestion;
