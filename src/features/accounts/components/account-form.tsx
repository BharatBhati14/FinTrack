"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  createAccountSchema,
  type CreateAccountInput,
} from "../schemas/createAccountSchema";

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

import { Alert, AlertDescription } from "@/components/ui/alert";

type AccountFormProps = {
  onSuccess: () => void;
  onCancel?: () => void;
};

export function AccountForm({ onSuccess, onCancel }: AccountFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateAccountInput>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      type: "BANK",
      currency: "INR",
      opening_balance: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  async function onSubmit(values: CreateAccountInput) {
    setServerError(null);

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
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
          payload?.error ?? "Unable to create account. Please try again.",
        );

        return;
      }

      reset();
      onSuccess();
    } catch (error) {
      console.error("Create account request failed:", error);

      setServerError(
        "Unable to connect to the server. Please check your connection and try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {/* Account name */}
      <div className="space-y-2">
        <Label htmlFor="account-name">Account name</Label>

        <Input
          id="account-name"
          placeholder="e.g. HDFC Bank"
          autoComplete="off"
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "account-name-error" : undefined}
          {...register("name")}
        />

        {errors.name && (
          <p id="account-name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Account type */}
      <div className="space-y-2">
        <Label htmlFor="account-type">Account type</Label>

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="account-type"
                aria-invalid={!!errors.type}
                aria-describedby={
                  errors.type ? "account-type-error" : undefined
                }
              >
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="BANK">Bank</SelectItem>

                <SelectItem value="CASH">Cash</SelectItem>

                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>

                <SelectItem value="WALLET">Wallet</SelectItem>

                <SelectItem value="INVESTMENT">Investment</SelectItem>

                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.type && (
          <p id="account-type-error" className="text-sm text-destructive">
            {errors.type.message}
          </p>
        )}
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label htmlFor="account-currency">Currency</Label>

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
                id="account-currency"
                aria-invalid={!!errors.currency}
                aria-describedby={
                  errors.currency ? "account-currency-error" : undefined
                }
              >
                <SelectValue placeholder="Select currency" />
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
          <p id="account-currency-error" className="text-sm text-destructive">
            {errors.currency.message}
          </p>
        )}
      </div>

      {/* Opening balance */}
      <div className="space-y-2">
        <Label htmlFor="opening-balance">Opening balance</Label>

        <Input
          id="opening-balance"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          autoComplete="off"
          disabled={isSubmitting}
          aria-invalid={!!errors.opening_balance}
          aria-describedby={
            errors.opening_balance
              ? "opening-balance-error"
              : "opening-balance-description"
          }
          {...register("opening_balance")}
        />

        {!errors.opening_balance && (
          <p
            id="opening-balance-description"
            className="text-xs text-muted-foreground"
          >
            Enter the current balance of this account.
          </p>
        )}

        {errors.opening_balance && (
          <p id="opening-balance-error" className="text-sm text-destructive">
            {errors.opening_balance.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}

          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
      </div>
    </form>
  );
}
