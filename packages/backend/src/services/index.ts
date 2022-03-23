import { DatabasePoolType } from 'slonik';
import * as L from '@effect-ts/core/Effect/Layer';
import { Has } from '@effect-ts/system/Has';
import { TodoRepositoryDefinition, LiveTodoRepository } from '../modules/todo';
import { getLiveDatabaseService } from '../infrastructure';

// TODO eventually break this down into sensible layers, where only top-level
// services are available everywhere
export type MainEnv = L.Layer<unknown, never, Has<TodoRepositoryDefinition>>;

/**
 * Wiring up services with lowest-level dependencies
 */
export const bootstrapServices = ({
  pool,
}: {
  pool: DatabasePoolType;
}): MainEnv => {
  const databaseService = getLiveDatabaseService(pool);

  const mainEnv: MainEnv = databaseService['>+>'](LiveTodoRepository);

  return mainEnv;
};
