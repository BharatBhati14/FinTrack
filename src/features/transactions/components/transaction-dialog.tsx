"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   createTransactionSchema,
//   type CreateTransactionInput,
// } from "../schemas/transactionSchema";
// import {
//     createTransactionSchema,
//   type CreateTransactionInput,
//   type CreateTransactionOutput,
// } from "../schemas/transactionSchema";
// import {
//   CreateTransactionOutput,
//   createTransactionSchema,
//   updateTransactionSchema,
//   type CreateTransactionInput,
//   type UpdateTransactionInput,
// } from "../schemas/transactionSchema";

// import {
//   createTransactionSchema,
//   type CreateTransactionInput,
//   type CreateTransactionOutput,
// } from "../schemas/transactionSchema";

import {
  createTransactionSchema,
  type CreateTransactionFormInput,
  type CreateTransactionInput,
} from "../schemas/transactionSchema";

import {
  createTransaction,
  updateTransaction,
  type Transaction,
} from "../hooks/use-transactions";

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

import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Account = {
  id: string;
  name: string;
  currency: string;
};

type Category = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

type TransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  accounts: Account[];
  categories: Category[];
  onSuccess: () => void;
};

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  accounts,
  categories,
  onSuccess,
}: TransactionDialogProps) {
  const editing = Boolean(transaction);
  const [serverError, setServerError] = useState<string | null>(null);

  // const form = useForm<CreateTransactionInput>({
  //   resolver: zodResolver(createTransactionSchema),
  const form = useForm<
    CreateTransactionFormInput,
    unknown,
    CreateTransactionInput
  >({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      accountId: "",
      categoryId: null,
      type: "EXPENSE",
      amount: "",
      description: "",
      transactionDate: new Date(),
    },
  });

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });

  const selectedAccountId = useWatch({
    control: form.control,
    name: "accountId",
  });

  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const selectedTransactionDate = useWatch({
    control: form.control,
    name: "transactionDate",
  }) as Date | undefined;

  useEffect(() => {
    if (!open) return;

    setServerError(null);

    if (transaction) {
      form.reset({
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        type: transaction.type === "TRANSFER" ? "EXPENSE" : transaction.type,
        amount: transaction.amount,
        description: transaction.description ?? "",
        transactionDate: new Date(transaction.transactionDate),
      });
    } else {
      form.reset({
        accountId: "",
        categoryId: null,
        type: "EXPENSE",
        amount: "",
        description: "",
        transactionDate: new Date(),
      });
    }
  }, [open, transaction, form]);

  const filteredCategories = categories.filter(
    (category) => category.type === selectedType,
  );

  async function onSubmit(values: CreateTransactionInput) {
    setServerError(null);

    try {
      if (editing && transaction) {
        const { type, ...updateValues } = values;

        await updateTransaction(transaction.id, updateValues);
      } else {
        await createTransaction(values);
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit transaction" : "Add transaction"}
          </DialogTitle>

          <DialogDescription>
            {editing
              ? "Update the details of this transaction."
              : "Record income or an expense."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {!editing && (
            <div className="space-y-2">
              <Label>Type</Label>

              <Select
                value={selectedType}
                onValueChange={(value) => {
                  if (!value) return;

                  form.setValue(
                    "type",
                    value as "INCOME" | "EXPENSE" | "TRANSFER",
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );

                  form.setValue("categoryId", null, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="EXPENSE">Expense</SelectItem>

                  <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
              </Select>

              {form.formState.errors.type && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="accountId">Account</Label>

            <Select
              value={selectedAccountId}
              onValueChange={(value) => {
                if (!value) return;

                form.setValue("accountId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger
                id="accountId"
                aria-invalid={!!form.formState.errors.accountId}
              >
                {/* <SelectValue placeholder="Select account" /> */}
                <SelectValue placeholder="Select account">
                  {(() => {
                    const selectedAccount = accounts.find(
                      (account) => account.id === selectedAccountId,
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
                    <div className="flex items-center gap-2">
                      <span>{account.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {account.currency}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {form.formState.errors.accountId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.accountId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>

            <Select
              value={selectedCategoryId ?? "none"}
              onValueChange={(value) => {
                if (!value) return;

                form.setValue("categoryId", value === "none" ? null : value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger id="categoryId">
                {/* <SelectValue placeholder="Select category" /> */}
                <SelectValue placeholder="Select category">
                  {(() => {
                    const selectedCategory = categories.find(
                      (category) => category.id === selectedCategoryId,
                    );

                    return selectedCategory?.name ?? null;
                  })()}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">No category</SelectItem>

                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {form.formState.errors.categoryId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>

            <Input
              id="amount"
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
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedTransactionDate && "text-muted-foreground",
                    )}
                  />
                }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {selectedTransactionDate
                  ? format(selectedTransactionDate, "PPP")
                  : "Select date"}
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedTransactionDate}
                  onSelect={(date) => {
                    if (!date) return;

                    form.setValue("transactionDate", date, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                />
              </PopoverContent>
            </Popover>

            {form.formState.errors.transactionDate && (
              <p className="text-sm text-destructive">
                {form.formState.errors.transactionDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              placeholder="Optional description"
              rows={3}
              {...form.register("description")}
              aria-invalid={!!form.formState.errors.description}
            />

            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
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

              {editing ? "Save changes" : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
