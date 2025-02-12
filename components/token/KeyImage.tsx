/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import Identicon from "react-blockies";

const IdenticonComponent = Identicon as any;

export const KeyImage = ({
  image,
  keyAddress,
  className,
}: {
  image?: string;
  keyAddress: string;
  className?: string;
}) => {
  const imageClass = cn(`h-14 w-14 rounded-full ${className}`);

  return (
    <div>
      {image ? (
        <img src={image} alt="Key Image" className={imageClass} />
      ) : (
        <IdenticonComponent
          seed={keyAddress}
          className={imageClass}
          size={12}
          scale={3}
        />
      )}
    </div>
  );
};
