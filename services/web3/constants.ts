import { Hex } from "viem";

export const TOKEN_RECIPE_ADDRESS =
  "0x965d4C4F249839207032bEbf806ca530763A5020" as Hex;
export const HELPER_ADDRESS =
  "0x1c7F50ebE4CA58dc5f1723B98dd8a4FD049b438f" as Hex;
export const KEY_RECIPE_ADDRESS =
  "0x32838574d1F2f4A815994f3ef38fd6B4b34E006E" as Hex;
// This one was only for testing but is not being used within the app right now
export const MOCK_RELAY_ADDRESS =
  "0x670caea8e4723abf5c9f8a24aec19279f8b7a813" as Hex;

export const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
export const PINATA_GATEWAY =
  "https://green-perfect-salamander-504.mypinata.cloud";
