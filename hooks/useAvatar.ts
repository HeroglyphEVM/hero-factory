import { useEffect, useState } from "react";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { ImageData, getNounData } from "@nouns/assets";

export const useUserSvgImage = (address: string): { profileSVG: string } => {
  const [svgBase64, setProfileSVG] = useState<string>("");

  useEffect(() => {
    if (!address) return; // Return early if `address` is null or empty
    const { palette } = ImageData; // Used with `buildSVG``

    // const seed = {
    //   background: 1,
    //   body: 11,
    //   accessory: 71,
    //   head: 29,
    //   glasses: 4,
    // };

    const seed = getNounSeedFromAddress(address);
    const { parts, background } = getNounData(seed);

    const svgBinary = buildSVG(parts, palette, "");
    const svgBase64 = btoa(svgBinary);
    setProfileSVG(svgBase64);
  }, [address]);

  return {
    profileSVG: svgBase64 ? svgBase64 : "",
  };
};

/**
 * Emulates the NounsSeeder.sol methodology for generating a Noun seed
 * @param nounId The Noun tokenId used to create pseudorandomness
 * @param blockHash The block hash use to create pseudorandomness
 */
export const getNounSeedFromAddress = (address: string): NounSeed => {
  const { images, bgcolors } = ImageData; // Used with `buildSVG``

  const pseudorandomness = solidityKeccak256(["address"], [address]);
  return {
    background: getPseudorandomPart(pseudorandomness, bgcolors.length, 0),
    body: getPseudorandomPart(pseudorandomness, images.bodies.length, 48),
    accessory: getPseudorandomPart(pseudorandomness, images.accessories.length, 96),
    head: getPseudorandomPart(pseudorandomness, images.heads.length, 144),
    glasses: getPseudorandomPart(pseudorandomness, images.glasses.length, 192),
  };
};

export interface ImageBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface DecodedImage {
  paletteIndex: number;
  bounds: ImageBounds;
  rects: [length: number, colorIndex: number][];
}
export interface NounSeed {
  background: number;
  body: number;
  accessory: number;
  head: number;
  glasses: number;
}

export interface EncodedImage {
  filename: string;
  data: string;
}

export interface NounData {
  parts: EncodedImage[];
  background: string;
}

/**
 * Decode the RLE image data into a format that's easier to consume in `buildSVG`.
 * @param image The RLE image data
 */
export const decodeImage = (image: string): DecodedImage => {
  const data = image.replace(/^0x/, "");
  const paletteIndex = parseInt(data.substring(0, 2), 16);
  const bounds = {
    top: parseInt(data.substring(2, 4), 16),
    right: parseInt(data.substring(4, 6), 16),
    bottom: parseInt(data.substring(6, 8), 16),
    left: parseInt(data.substring(8, 10), 16),
  };
  const rects = data.substring(10);

  return {
    paletteIndex,
    bounds,
    rects:
      rects?.match(/.{1,4}/g)?.map(rect => [parseInt(rect.substring(0, 2), 16), parseInt(rect.substring(2, 4), 16)]) ??
      [],
  };
};

/**
 * @notice Given an x-coordinate, draw length, and right bound, return the draw
 * length for a single SVG rectangle.
 */
const getRectLength = (currentX: number, drawLength: number, rightBound: number): number => {
  const remainingPixelsInLine = rightBound - currentX;
  return drawLength <= remainingPixelsInLine ? drawLength : remainingPixelsInLine;
};

/**
 * Given RLE parts, palette colors, and a background color, build an SVG image.
 * @param parts The RLE part datas
 * @param paletteColors The hex palette colors
 * @param bgColor The hex background color
 */
export const buildSVG = (parts: { data: string }[], paletteColors: string[], bgColor?: string): string => {
  const svgWithoutEndTag = parts.reduce((result, part) => {
    const svgRects: string[] = [];
    const { bounds, rects } = decodeImage(part.data);

    let currentX = bounds.left;
    let currentY = bounds.top;

    rects.forEach(draw => {
      let drawLength = draw[0];
      const colorIndex = draw[1];
      const hexColor = paletteColors[colorIndex];

      let length = getRectLength(currentX, drawLength, bounds.right);
      while (length > 0) {
        // Do not push rect if transparent
        if (colorIndex !== 0) {
          svgRects.push(
            `<rect width="${length * 10}" height="10" x="${currentX * 10}" y="${currentY * 10}" fill="#${hexColor}" />`,
          );
        }

        currentX += length;
        if (currentX === bounds.right) {
          currentX = bounds.left;
          currentY++;
        }

        drawLength -= length;
        length = getRectLength(currentX, drawLength, bounds.right);
      }
    });
    result += svgRects.join("");
    return result;
  }, `<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${bgColor ? `#${bgColor}` : "none"}" />`);

  return `${svgWithoutEndTag}</svg>`;
};

/**
 * Emulate bitwise right shift and uint cast
 * @param value A Big Number
 * @param shiftAmount The amount to right shift
 * @param uintSize The uint bit size to cast to
 */
export const shiftRightAndCast = (value: BigNumberish, shiftAmount: number, uintSize: number): string => {
  const shifted = BigNumber.from(value).shr(shiftAmount).toHexString();
  return `0x${shifted.substring(shifted.length - uintSize / 4)}`;
};

/**
 * Emulates the NounsSeeder.sol methodology for pseudorandomly selecting a part
 * @param pseudorandomness Hex representation of a number
 * @param partCount The number of parts to pseudorandomly choose from
 * @param shiftAmount The amount to right shift
 * @param uintSize The size of the unsigned integer
 */
export const getPseudorandomPart = (
  pseudorandomness: string,
  partCount: number,
  shiftAmount: number,
  uintSize = 48,
): number => {
  const hex = shiftRightAndCast(pseudorandomness, shiftAmount, uintSize);
  return BigNumber.from(hex).mod(partCount).toNumber();
};

// /**
//  * Emulates the NounsSeeder.sol methodology for generating a Noun seed
//  * @param nounId The Noun tokenId used to create pseudorandomness
//  * @param blockHash The block hash use to create pseudorandomness
//  */
// export const getNounSeedFromBlockHash = (nounId: BigNumberish, blockHash: string): NounSeed => {
//   const pseudorandomness = solidityKeccak256(['bytes32', 'uint256'], [blockHash, nounId]);
//   return {
//     background: getPseudorandomPart(pseudorandomness, bgcolors.length, 0),
//     body: getPseudorandomPart(pseudorandomness, bodies.length, 48),
//     accessory: getPseudorandomPart(pseudorandomness, accessories.length, 96),
//     head: getPseudorandomPart(pseudorandomness, heads.length, 144),
//     glasses: getPseudorandomPart(pseudorandomness, glasses.length, 192),
//   };
// };

export const useCustomSvgImage = (inputString: string): { profileSVG: string } => {
  const [svgBase64, setProfileSVG] = useState<string>("");

  useEffect(() => {
    if (!inputString) return; // Return early if `inputString` is null or empty
    const { palette } = ImageData; // Used with `buildSVG`

    const seed = getNounSeedFromString(inputString);
    const { parts, background } = getNounData(seed);

    const svgBinary = buildSVG(parts, palette, background);
    const svgBase64 = btoa(svgBinary);
    setProfileSVG(svgBase64);
  }, [inputString]);

  return {
    profileSVG: svgBase64 ? svgBase64 : "",
  };
};

export const getNounSeedFromString = (inputString: string): NounSeed => {
  const { images, bgcolors } = ImageData;

  const pseudorandomness = solidityKeccak256(["string"], [inputString]);
  return {
    background: getPseudorandomPart(pseudorandomness, bgcolors.length, 0),
    body: getPseudorandomPart(pseudorandomness, images.bodies.length, 48),
    accessory: getPseudorandomPart(pseudorandomness, images.accessories.length, 96),
    head: getPseudorandomPart(pseudorandomness, images.heads.length, 144),
    glasses: getPseudorandomPart(pseudorandomness, images.glasses.length, 192),
  };
};

// ... rest of the existing code ...
