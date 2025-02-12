/* eslint-disable @next/next/no-img-element */
import { KeyRedeemType } from "@/types/key-types";
import Identicon from "react-blockies";

const IdenticonComponent = Identicon as any;

export const KeyItem = ({ item }: { item: KeyRedeemType }) => {
  return (
    <div
      key={item.tokenId}
      className="flex flex-col items-center p-2 rounded-lg"
    >
      <div className="w-24 h-24 relative mb-2">
        {item.image ? (
          <img src={item.image} alt={item.tokenId} />
        ) : (
          <IdenticonComponent
            seed={item.keyAddress + item.tokenId}
            size={24}
            scale={4}
          />
        )}
      </div>
      <span className="text-white text-lg font-bold">{item.name}</span>
      <span className="text-gray-400 text-xs">
        {Math.floor((Date.now() / 1000 - item.timestamp) / 86400)}d ago
      </span>
    </div>
  );
};
