import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { Board } from '../modules/Board/Board';

const boardSearchSchema = z.object({
  q: z.string().optional().catch(''),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export type BoardSearch = z.infer<typeof boardSearchSchema>;

export const Route = createFileRoute('/board/$projectId')({
  validateSearch: (search) => boardSearchSchema.parse(search),
  component: BoardPage,
});

function BoardPage() {
  const { projectId } = Route.useParams();
  const search = Route.useSearch();

  return <Board projectId={projectId} search={search} />;
}
