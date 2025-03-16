import { Match } from '@interfaces/match.interface';
import { Match as MatchEntity } from '@prisma/client';
import { CrudRepositoryBase } from '@repositories/crudRepositoryBase';
import { MatchDaoPostgres } from '@daos/match.dao.postgres';
import { MatchMapper } from '@mappers/entities/match.mapper'

export class MatchRepository extends CrudRepositoryBase<Match, MatchEntity> {
    constructor() {
        super(new MatchDaoPostgres(), new MatchMapper());
    }
}
