import MemberGroupDetailClient from "@/components/church/MemberGroupDetailClient";

export default async function MemberGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MemberGroupDetailClient groupId={id} />;
}