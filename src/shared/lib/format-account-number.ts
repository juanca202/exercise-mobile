const MASK_PREFIX = "****";

export function formatAccountNumber(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");
  const lastFour = digits.slice(-4);

  if (lastFour.length === 0) {
    return MASK_PREFIX;
  }

  return `${MASK_PREFIX}${lastFour}`;
}

export function formatAccountNumberDisplay(accountNumber: string): string {
  const masked = formatAccountNumber(accountNumber);
  return `********${masked.replace(MASK_PREFIX, "")}`;
}
