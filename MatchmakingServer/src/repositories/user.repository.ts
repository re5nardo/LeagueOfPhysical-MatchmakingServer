import { User } from '@interfaces/user.interface';
import { GenericCacheCrudRepository } from '@repositories/genericCacheCrud.repository';
import { UserDaoRedisImpl } from '@daos/user.dao.redis';
import { UserDaoMongooseImpl } from '@daos/user.dao.mongoose';

export class UserRepository extends GenericCacheCrudRepository<User, string> {
    constructor() {
        super(new UserDaoMongooseImpl(), new UserDaoRedisImpl());
    }
}
