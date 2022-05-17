export type Todo = {
  // TODO: brand id
  id: string;
  title: string;
  description: string;
  createdAt: Date;
} & (
  | {
      // Frontend state before committing to the server
      status: 'draft';
    }
  | {
      status: 'created';
    }
  | {
      status: 'completed';
      completedAt: Date;
    }
);
