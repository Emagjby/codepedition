import LoggedInLayout from "@/components/LoggedInLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoggedInLayout>{children}</LoggedInLayout>;
} 