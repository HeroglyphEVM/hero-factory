import { fetchTokenMetadata } from "@/services/pinata/pinataService";
import { KeyDescriptor } from "@/types/key-types";
import { useEffect, useState } from "react";

type GetKeyDescriptorResponse = {
  data: KeyDescriptor;
  isLoading: boolean;
  isError: boolean;
};

export const useGetKeyDescriptor = (cid?: string): GetKeyDescriptorResponse => {
  const [data, setData] = useState<KeyDescriptor>({
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

const parseMetadata = (metadata: any): KeyDescriptor => { 
  console.log("metadata", metadata)
  return {
    description: metadata.description || "",
    website: metadata.website || "",
    x: metadata.x || "",
    telegram: metadata.telegram || "",
    chat: metadata.chat || "",
  }
}