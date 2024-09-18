import { Match } from '@interfaces/match.interface';
import { CrudRepositoryBase } from '@repositories/crudRepositoryBase';
import { MatchDaoMongoose } from '@daos/match.dao.mongoose';

export class MatchRepository extends CrudRepositoryBase<Match, string> {
    constructor() {
        super(new MatchDaoMongoose());
    }
}
