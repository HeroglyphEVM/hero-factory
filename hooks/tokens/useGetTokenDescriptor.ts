import { fetchTokenMetadata } from "@/services/pinata/pinataService";
import { TokenDescriptor } from "@/types/token-types";
import { useEffect, useState } from "react";

type GetTokenDescriptorResponse = {
  data: TokenDescriptor;
  isLoading: boolean;
  isError: boolean;
};

export const useGetTokenDescriptor = (cid?: string): GetTokenDescriptorResponse => {
  const [data, setData] = useState<TokenDescriptor>({
    description: "",
    website: "",
    x: "",
    telegram: "",
    chat: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!cid) {
        setIsLoading(false);
        return;
      }
      try {
        const metadata = await fetchTokenMetadata(cid);
        setData(parseMetadata(metadata));
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchMetadata();
  }, [cid]);

  return { data, isLoading, isError };
}

const parseMetadata = (metadata: any): TokenDescriptor => { 
  return {
    description: metadata.description || "",
    website: metadata.website || "",
    x: metadata.x || "",
    telegram: metadata.telegram || "",
    chat: metadata.chat || "",
  }
}