"use client";

import { useState } from "react";

import { HOME_PATH, TRANSFER_OWN_PATH } from "@/shared/routes";

import {
  TransferBackHeader,
  TransferOptionCard,
  TransferScreenShell,
} from "./transfer-ui";

type TransferTypeScreenProps = {
  thirdPartyUnavailableMessage?: string;
};

export function TransferTypeScreen({
  thirdPartyUnavailableMessage = "Esta función no está disponible en la demostración.",
}: TransferTypeScreenProps) {
  const [thirdPartyNotice, setThirdPartyNotice] = useState<string | null>(null);

  return (
    <TransferScreenShell>
      <TransferBackHeader
        backHref={HOME_PATH}
        subtitle="Transferir mi dinero"
        title="Transferencias"
      />

      <div className="flex flex-col gap-4">
        <TransferOptionCard
          description="Transfiere dinero de forma inmediata."
          href={TRANSFER_OWN_PATH}
          icon="between-accounts"
          title="Entre mis cuentas"
        />
        <TransferOptionCard
          description="Transfiere dinero a otros beneficiarios."
          icon="third-party"
          onClick={() => setThirdPartyNotice(thirdPartyUnavailableMessage)}
          title="A terceros"
        />
      </div>

      {thirdPartyNotice ? (
        <p
          className="mt-4 rounded-input bg-white/80 px-4 py-3 text-body text-secondary"
          role="status"
        >
          {thirdPartyNotice}
        </p>
      ) : null}
    </TransferScreenShell>
  );
}
