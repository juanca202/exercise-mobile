import {
  AuthenticatedShell,
  LogoutButton,
  ProtectedPageClient,
} from "@/features/auth";

export default function HomePage() {
  return (
    <ProtectedPageClient>
      <AuthenticatedShell>
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-[#17191F]">
            Bienvenido a tu resumen
          </h2>
          <p className="mt-2 text-sm text-[#606060]">
            Contenido de demostración. El detalle de cuentas se implementará en
            US-002.
          </p>
          <div className="mt-6">
            <LogoutButton label="Cerrar sesión desde resumen" />
          </div>
        </section>
      </AuthenticatedShell>
    </ProtectedPageClient>
  );
}
