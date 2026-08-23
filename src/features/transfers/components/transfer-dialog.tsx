"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTransferSchema,
  type CreateTransferInput,
  type CreateTransferFormInput,
} from "../schemas/transferSchema";

import { createTransfer } from "../services/client.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Account = {
  id: string;
  name: string;
  currency: string;
};

type TransferDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
  onSuccess: () => void;
};

export function TransferDialog({
  open,
  onOpenChange,
  accounts,
  onSuccess,
}: TransferDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateTransferFormInput, unknown, CreateTransferInput>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: {
      fromAccountId: "",
      toAccountId: "",
      amount: "",
      description: "",
      transferDate: new Date(),
    },
  });

  useEffect(() => {
    if (open) {
      setServerError(null);

      form.reset({
        fromAccountId: "",
        toAccountId: "",
        amount: "",
        description: "",
        transferDate: new Date(),
      });
    }
  }, [open, form]);

  async function onSubmit(values: CreateTransferInput) {
    setServerError(null);

    try {
      await createTransfer(values);

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  const sourceId = form.watch("fromAccountId");

  const destinationAccounts = accounts.filter(
    (account) => account.id !== sourceId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Transfer money</DialogTitle>

          <DialogDescription>
            Move money between your accounts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label>From account</Label>

            <Select
              value={form.watch("fromAccountId")}
              onValueChange={(value) => {
                if (!value) return;

                form.setValue("fromAccountId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });

                if (form.getValues("toAccountId") === value) {
                  form.setValue("toAccountId", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source account">
                  {(() => {
                    const selectedAccount = accounts.find(
                      (account) => account.id === form.watch("fromAccountId"),
                    );

                    return selectedAccount ? (
                      <div className="flex items-center gap-2">
                        <span>{selectedAccount.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {selectedAccount.currency}
                        </span>
                      </div>
                    ) : null;
                  })()}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} · {account.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {form.formState.errors.fromAccountId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.fromAccountId.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <div className="rounded-full border bg-muted p-2">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>To account</Label>

            <Select
              value={form.watch("toAccountId")}
              onValueChange={(value) => {
                if (!value) return;

                form.setValue("toAccountId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination account">
                  {(() => {
                    const selectedAccount = accounts.find(
                      (account) => account.id === form.watch("toAccountId"),
                    );

                    return selectedAccount ? (
                      <div className="flex items-center gap-2">
                        <span>{selectedAccount.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {selectedAccount.currency}
                        </span>
                      </div>
                    ) : null;
                  })()}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {destinationAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} · {account.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {form.formState.errors.toAccountId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.toAccountId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transfer-amount">Amount</Label>

            <Input
              id="transfer-amount"
              inputMode="decimal"
              placeholder="0.00"
              {...form.register("amount")}
              aria-invalid={!!form.formState.errors.amount}
            />

            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date</Label>

            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {format(
                      form.watch("transferDate") as Date | string | number,
                      "PPP",
                    )}
                  </Button>
                }
              />

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("transferDate") as Date | undefined}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue("transferDate", date, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transfer-description">Description</Label>

            <Textarea
              id="transfer-description"
              placeholder="Optional description"
              rows={3}
              {...form.register("description")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
