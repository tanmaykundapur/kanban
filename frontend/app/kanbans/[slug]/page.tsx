import KanbanBoard from "@/components/KanbanBoard";

// Set Type for Params
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Kanban({ params }: PageProps) {
  const { slug } = await params;

  return (
    <>
      <div className="m-30 p-10 font-sans">
        <a
          href="/kanbans"
          className="position-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </a>
        <KanbanBoard currentKanban={slug} />
      </div>
    </>
  );
}
