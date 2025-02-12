import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function InvalidToken() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Invalid Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            The token you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/tokens">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tokens
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}