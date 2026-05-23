import { Video } from 'lucide-react';
import { getYouTubeEmbedUrl } from '@/lib/youtube';

type VehicleVideoProps = {
  videoUrl?: string;
  title: string;
  placeholder: string;
  heading: string;
  iconClassName?: string;
  frameClassName?: string;
};

export default function VehicleVideo({
  videoUrl,
  title,
  placeholder,
  heading,
  iconClassName = 'h-8 w-8 text-red-600 drop-shadow-md',
  frameClassName = 'relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-black bg-zinc-900 shadow-inner',
}: VehicleVideoProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="rounded-3xl border-4 border-zinc-200 bg-white p-8 shadow-[0_15px_30px_rgba(0,0,0,0.1)] md:p-12">
      <h2 className="mb-8 flex items-center gap-3 border-b-4 border-zinc-100 pb-4 font-heading text-3xl font-black text-black">
        <Video className={iconClassName} aria-hidden />
        {heading}
      </h2>
      <div className={frameClassName}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="text-center text-zinc-500">
            <Video className="mx-auto mb-4 h-16 w-16 opacity-50" aria-hidden />
            <p className="font-bold uppercase tracking-widest">{placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
}
