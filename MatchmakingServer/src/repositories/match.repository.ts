import { Match } from '@interfaces/match.interface';
import { CrudRepositoryBase } from '@repositories/crudRepositoryBase';
import { MatchDaoPostgres } from '@daos/match.dao.postgres';

export class MatchRepository extends CrudRepositoryBase<Match> {
    constructor() {
        super(new MatchDaoPostgres());
    }
}
