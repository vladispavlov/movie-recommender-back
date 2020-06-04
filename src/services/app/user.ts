import { User } from '../../models/app/User'
import { Movie } from '../../models/app/Movie'
import { Service, Inject } from 'typedi'
import { ReturnModelType } from '@typegoose/typegoose'
import * as winston from 'winston'
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher'
import events from '../../subscribers/events'
import { Types } from 'mongoose'

@Service()
export class UserService {
    constructor(
        @Inject('AppDB UserModel')
        private UserModel: ReturnModelType<typeof User>,
        @Inject('AppDB MovieModel')
        private MovieModel: ReturnModelType<typeof Movie>,
        @Inject('AppLogger')
        private logger: winston.Logger,
        @EventDispatcher()
        private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async deleteUser(id: Types.ObjectId) {
        try {
            const userDocument = await this.UserModel
                .findByIdAndDelete(id)
                .exec()
            await this.MovieModel
                .deleteMany({
                    user: userDocument._id
                })
                .exec()
        } catch (e) {
            throw e
        }
    }
}