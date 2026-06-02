import Link from "next/link";

import { HOME_PATH } from "@/shared/routes";

export default function DemoUnavailablePage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-surface-elevated px-4 py-8">
      <div className="w-full max-w-lg rounded-modal border border-border bg-white p-8 text-center shadow-sm">
        <h1 className="text-h2 text-heading">Funcionalidad no disponible</h1>
        <p className="mt-3 text-body text-muted">
          Esta opción no está disponible en la demo. Próximamente podrás usarla
          en el producto completo.
        </p>
        <Link
          className="mt-6 inline-flex rounded-pill bg-primary px-8 py-3 text-button font-medium text-white hover:bg-primary-deep"
          href={HOME_PATH}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
