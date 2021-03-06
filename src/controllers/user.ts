import { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import * as winston from 'winston'
import { UserService } from '../services/app/user'
import { UserPayload } from '../interfaces/User'
import { Types } from 'mongoose'

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    const logger: winston.Logger = Container.get('AppLogger')
    const userServiceInstance = Container.get(UserService)

    try {
        if (!res.locals['payload']) {
            throw new Error('Invalid payload')
        }

        const payload = res.locals['payload'] as UserPayload
        await userServiceInstance.deleteUser(payload.id)

        return res.sendStatus(204)
    } catch (e) {
        logger.error('🔥 error ', e)
        return next(e)
    }
}

export async function getSeenMovies(req: Request, res: Response, next: NextFunction) {
    const logger: winston.Logger = Container.get('AppLogger')
    const userServiceInstance = Container.get(UserService)
    const payload = res.locals['payload'] as UserPayload

    try {
        const userId = payload.id
        const seen = await userServiceInstance.getSeenMovies(userId)

        return res
            .status(200)
            .json({
                seen
            })
    } catch (e) {
        logger.error('🔥 error ', e)
        return next(e)
    }
}

export async function addSeenMovie(req: Request, res: Response, next: NextFunction) {
    const logger: winston.Logger = Container.get('AppLogger')
    const userServiceInstance = Container.get(UserService)
    const payload = res.locals['payload'] as UserPayload

    try {
        const userId = payload.id
        const mediaId = Types.ObjectId(req.body['media'])
        const score = Number(req.body['score'])
        const seen = await userServiceInstance.addSeenMovie(userId, mediaId, score)

        return res
            .status(201)
            .json({
                seen
            })
    } catch (e) {
        logger.error('🔥 error ', e)
        return next(e)
    }
}

export async function deleteSeenMovie(req: Request, res: Response, next: NextFunction) {
    const logger: winston.Logger = Container.get('AppLogger')
    const userServiceInstance = Container.get(UserService)

    try {
        const seenId = Types.ObjectId(req.params['id'])
        await userServiceInstance.deleteSeenMovie(seenId)

        return res.sendStatus(200)
    } catch (e) {
        logger.error('🔥 error ', e)
        return next(e)
    }
}

export async function updateSeenMovie(req: Request, res: Response, next: NextFunction) {
    const logger: winston.Logger = Container.get('AppLogger')
    const userServiceInstance = Container.get(UserService)

    try {
        const seenId = Types.ObjectId(req.params['id'])
        const score = Number(req.body['score'])
        const seen = await userServiceInstance.updateSeenMovie(seenId, score)

        if (!seen) {
            const err = new Error('Not found')
            err['status'] = 404
            return next(err)
        }

        return res
            .status(201)
            .json({
                seen
            })
    } catch (e) {
        logger.error('🔥 error ', e)
        return next(e)
    }
}

export async function getRecommendations(req: Request, res: Response, next: NextFunction) {
    const logger: winston.Logger = Container.get('AppLogger')
    const userServiceInstance = Container.get(UserService)
    const payload = res.locals['payload'] as UserPayload

    try {
        const userId = payload.id
        const recommendations = await userServiceInstance.getRecommendations(userId.toString(), 10)
        return res
            .status(200)
            .json({
                recommendations
            })
    } catch (e) {
        logger.error('🔥 error ', e)
        return next(e)
    }
}
