/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import Identicon from "react-blockies";

const IdenticonComponent = Identicon as any;

export const TokenImage = ({
  image,
  tokenAddress,
  className,
}: {
  image?: string;
  tokenAddress: string;
  className?: string;
}) => {
  const imageClass = cn(`h-14 w-14 rounded-full ${className}`);

  return (
    <div>
      {image ? (
        <img src={image} alt="Token Image" className={imageClass} />
      ) : (
        <IdenticonComponent
          seed={tokenAddress}
          className={imageClass}
          size={12}
          scale={3}
        />
      )}
    </div>
  );
};
