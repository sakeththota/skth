import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NowPlayingProps {
  album: string;
  albumImageUrl: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

export const NowPlaying = ({
  albumImageUrl,
  title,
  artist,
}: NowPlayingProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex h-20 gap-4 rounded-md p-2 w-80">
            <div className="relative aspect-square h-full w-auto">
              <img
                className="rounded-md absolute inset-0 h-full w-full object-cover"
                src={albumImageUrl}
              />
            </div>
            <div className="flex flex-col justify-center items-start overflow-hidden whitespace-nowrap">
              <p className="text-xs text-muted-foreground">Now Playing</p>
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="text-semibold -mt-1">{artist}</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>This component tracks my Spotify activity live!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
