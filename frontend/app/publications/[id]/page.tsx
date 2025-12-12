import { PaperDetailPage } from '@/components/PaperDetailPage'

export default async function PaperDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PaperDetailPage paperId={id} />
}

