import { Navbar } from "@/components/ui/Navbar";

export default function TransferLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="flex flex-1 flex-col">{children}</div>
      <Navbar activeItem="transfer" />
    </div>
  );
}
