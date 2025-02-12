import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { blo } from "blo";
import { useUserSvgImage, useCustomSvgImage } from "@/hooks/useAvatar";

// // Custom Avatar for RainbowKit
export const RainbowAvatar: AvatarComponent = ({ address, ensImage, size }) => (
  // Don't want to use nextJS Image here (and adding remote patterns for the URL)
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="rounded-full"
    src={ensImage || blo(address as `0x${string}`)}
    width={size}
    height={size}
    alt={`${address} avatar`}
  />
);

// Custom Avatar for RainbowKit
export const BlockNounAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  // Don't want to use nextJS Image here (and adding remote patterns for the URL)
  // eslint-disable-next-line @next/next/no-img-element
  const { profileSVG } = useUserSvgImage(address);
  return <img className={`  h-${size} w-${size}`} src={`data:image/svg+xml;base64,${profileSVG}`} />;
};

export const BlockNounString: React.FC<{ inputString: string; size?: number }> = ({
  inputString,
  size = 24,
}) => {
  const { profileSVG } = useCustomSvgImage(inputString);
  if (!profileSVG) {
    return null;
  }
  return (
    <img className={`  h-${size} w-${size}`}
      src={`data:image/svg+xml;base64,${profileSVG}`}
    />
  );
};