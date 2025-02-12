import { useState } from "react";
import { MutateOptions } from "@tanstack/react-query";
import { Abi } from "abitype";
import { AbiStateMutability, Address, ContractFunctionArgs, ContractFunctionName, Hex } from "viem";
import { Config, UseWriteContractParameters, useAccount, useWriteContract } from "wagmi";
import { WriteContractErrorType, WriteContractReturnType } from "wagmi/actions";
import { WriteContractVariables } from "wagmi/query";
import { useTransactor } from "./useTransactor";
import appConfig from "@/app.config";
import { useToast } from "@/hooks/use-toast";


export type WriteContractConfig = {
  contractAddress: Hex;
  functionName: string
  args: ContractFunctionArgs<Abi, AbiStateMutability, ContractFunctionName>
}

export const useContractWrite = ({
  abi,
  contractAddress,
  args,
  writeContractParams,
}: {
  abi: Abi;
  contractAddress: Address;
  args?: any[];
  writeContractParams?: UseWriteContractParameters;
}) => {
  const { chain, isConnected } = useAccount();
  const writeTx = useTransactor();
  const [isMining, setIsMining] = useState(false);
  const targetNetwork = appConfig.targetNetwork;
  const { toast } = useToast()

  const wagmiContractWrite = useWriteContract(writeContractParams);

  const sendContractWriteAsyncTx = async(
    variables?: any,
    options?: any,
  ) => {
    if (!isConnected) {
      toast({
        description: "Please connect your wallet",
        variant: "destructive",
      })
      return;
    }
    if (chain?.id !== targetNetwork.id) {
      toast({
        description: "You are on the wrong network",
        variant: "destructive",
      })
      return;
    }

    if (!variables?.args) {
      if (!variables) {
        variables = {};
      }
      variables.args = args;
    }

    try {
      setIsMining(true);
      const { blockConfirmations, onBlockConfirmation, ...mutateOptions } = options || {};
      const makeWriteWithParams = () =>
        wagmiContractWrite.writeContractAsync(
          {
            abi: abi,
            address: contractAddress,
            ...variables,
          } as WriteContractVariables<Abi, string, any[], Config, number>,
          mutateOptions as
            | MutateOptions<
                WriteContractReturnType,
                WriteContractErrorType,
                WriteContractVariables<Abi, string, any[], Config, number>,
                unknown
              >
            | undefined,
        );
      const writeTxResult = await writeTx(makeWriteWithParams, { blockConfirmations, onBlockConfirmation });

      return writeTxResult;
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsMining(false);
    }
  };

  const sendContractWriteTx = (
    variables: any,
    options?: any,
  ) => {
    if (!isConnected) {
      toast({
        description: "Please connect your wallet",
        variant: "destructive",
      })
      return;
    }
    if (chain?.id !== targetNetwork.id) {
      toast({
        description: "You are on the wrong network",
        variant: "destructive",
      })
      return;
    }

    wagmiContractWrite.writeContract(
      {
        abi: abi,
        address: contractAddress,
        ...variables,
      } as WriteContractVariables<Abi, string, any[], Config, number>,
      options as
        | MutateOptions<
            WriteContractReturnType,
            WriteContractErrorType,
            WriteContractVariables<Abi, string, any[], Config, number>,
            unknown
          >
        | undefined,
    );
  };

  return {
    ...wagmiContractWrite,
    isMining,
    writeContractAsync: sendContractWriteAsyncTx,
    writeContract: sendContractWriteTx,
  };
};
