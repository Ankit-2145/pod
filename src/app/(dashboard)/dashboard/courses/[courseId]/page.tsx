export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <div>
      <h1>Course Page</h1>
      <p>Course ID: {courseId}</p>
    </div>
  );
}
