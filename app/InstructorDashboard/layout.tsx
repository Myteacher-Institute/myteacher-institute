export const metadata = {
    title: "Dashboard - Myteacher Institute",
    description: "Center of IT solutions and digital courses",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
