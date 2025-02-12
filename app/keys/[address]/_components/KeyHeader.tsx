import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { KeyDescriptor } from "@/types/key-types";
import { KeyData } from "@/types/key-types";

import { ArrowLeft, Globe, MessageCircle, Settings2 } from "lucide-react";
import Link from "next/link";
// import Identicon from "react-blockies";
import { XOutlinedIcon } from "@/components/icons/XOutlinedIcon";
import React from "react";
import { TelegramIcon } from "@/components/icons/TelegramIcon";
import { KeyImage } from "@/components/token/KeyImage";

type KeyHeaderProps = {
  keyData: KeyData;
  keyDescriptor: KeyDescriptor;
};

export const KeyHeader = ({ keyData, keyDescriptor }: KeyHeaderProps) => {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex-grow">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2 inline-block" />
              Back
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex justify-center">
              <KeyImage image={keyData.image} keyAddress={keyData.address} />
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold mb-2">${keyData.symbol}</h1>
              <p className="text-xl text-muted-foreground">{keyData.name}</p>
            </div>
            {/* <div> 
            <h1 className="text-xl font-bold">{keyData.name} ({keyData.symbol})</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{beautifyAddress(keyData.contractAddress)}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(keyData.contractAddress)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div> */}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        {keyDescriptor.website && (
          <Button variant="ghost" size="icon" asChild>
            <a
              href={keyDescriptor.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="h-6 w-6 text-muted-foreground" />
              <span className="sr-only">Visit website</span>
            </a>
          </Button>
        )}
        {keyDescriptor.x && (
          <Button variant="ghost" size="icon" asChild>
            <a href={keyDescriptor.x} target="_blank" rel="noopener noreferrer">
              <XOutlinedIcon className="h-6 w-6 text-muted-foreground" />
              <span className="sr-only">X</span>
            </a>
          </Button>
        )}
        {keyDescriptor.chat && (
          <Button variant="ghost" size="icon" asChild>
            <a
              href={keyDescriptor.chat}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-6 w-6 text-muted-foreground" />
              <span className="sr-only">Chat</span>
            </a>
          </Button>
        )}
        {keyDescriptor.telegram && (
          <Button variant="ghost" size="icon" asChild>
            <a
              href={keyDescriptor.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TelegramIcon className="h-6 w-6 text-muted-foreground" />
              <span className="sr-only">Telegram</span>
            </a>
          </Button>
        )}
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/keys/${keyData.address}/settings`}>
            <Settings2 className="h-6 w-6 text-muted-foreground" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
      </div>
    </header>
  );
};
