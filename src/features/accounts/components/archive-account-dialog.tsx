"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Alert, AlertDescription } from "@/components/ui/alert";

type ArchiveAccountDialogProps = {
  account: {
    id: string;
    name: string;
  } | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => void;
};

export function ArchiveAccountDialog({
  account,
  open,
  onOpenChange,
  onSuccess,
}: ArchiveAccountDialogProps) {
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleArchive() {
    if (!account || isArchiving) {
      return;
    }

    setError(null);
    setIsArchiving(true);

    try {
      const response = await fetch(`/api/accounts/${account.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Your session has expired. Please sign in again.");
        } else {
          setError(
            payload?.error ??
              "Unable to archive the account. Please try again.",
          );
        }

        return;
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Archive account request failed:", error);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsArchiving(false);
    }
  }

  function handleOpenChange(value: boolean) {
    if (isArchiving) {
      return;
    }

    if (!value) {
      setError(null);
    }

    onOpenChange(value);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive account?</AlertDialogTitle>

          <AlertDialogDescription>
            {account ? (
              <>
                This will archive{" "}
                <span className="font-medium text-foreground">
                  {account.name}
                </span>
                . The account will no longer appear in your active accounts.
              </>
            ) : (
              "This account will be archived."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleArchive();
            }}
            disabled={isArchiving}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isArchiving && <Loader2 className="mr-2 size-4 animate-spin" />}

            {isArchiving ? "Archiving..." : "Archive account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
