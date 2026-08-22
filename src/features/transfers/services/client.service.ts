import type { CreateTransferInput } from "../schemas/transferSchema";

export async function createTransfer(input: CreateTransferInput) {
  const response = await fetch("/api/transfers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to create transfer");
  }

  return result.data;
}
