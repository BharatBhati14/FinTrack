"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateAccountSchema,
  type UpdateAccountInput,
} from "../schemas/updateAccountSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Alert, AlertDescription } from "@/components/ui/alert";

type Account = {
  id: string;
  name: string;
  currency: string;
  status: "ACTIVE" | "ARCHIVED";
};

type EditAccountDialogProps = {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function EditAccountDialog({
  account,
  open,
  onOpenChange,
  onSuccess,
}: EditAccountDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: "",
      currency: "INR",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!account) {
      return;
    }

    reset({
      name: account.name,
      currency: account.currency as UpdateAccountInput["currency"],
    });

    setServerError(null);
  }, [account, reset]);

  async function onSubmit(values: UpdateAccountInput) {
    if (!account) {
      return;
    }

    setServerError(null);

    try {
      const response = await fetch(`/api/accounts/${account.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setServerError("Your session has expired. Please sign in again.");

          return;
        }

        setServerError(
          payload?.error ?? "Unable to update the account. Please try again.",
        );

        return;
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Update account request failed:", error);

      setServerError("Unable to connect to the server. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>

          <DialogDescription>
            Update the account name or currency.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-account-name">Account name</Label>

            <Input
              id="edit-account-name"
              {...register("name")}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={
                errors.name ? "edit-account-name-error" : undefined
              }
            />

            {errors.name && (
              <p
                id="edit-account-name-error"
                className="text-sm text-destructive"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="edit-account-currency">Currency</Label>

            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="edit-account-currency"
                    aria-invalid={!!errors.currency}
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="INR">INR — Indian Rupee</SelectItem>

                    <SelectItem value="USD">USD — US Dollar</SelectItem>

                    <SelectItem value="EUR">EUR — Euro</SelectItem>

                    <SelectItem value="GBP">GBP — British Pound</SelectItem>

                    <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>

                    <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>

                    <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>

                    <SelectItem value="SGD">SGD — Singapore Dollar</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.currency && (
              <p className="text-sm text-destructive">
                {errors.currency.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}

              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
