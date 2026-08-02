import ChurchAdminGroupDetailClient from "@/components/church/ChurchAdminGroupDetailClient";

export default async function ChurchAdminGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChurchAdminGroupDetailClient groupId={id} />;
}