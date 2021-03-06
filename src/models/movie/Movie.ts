import { prop, Ref, modelOptions, ReturnModelType } from '@typegoose/typegoose'
import { Genre } from './Genre'
import { Company } from './Company'
import { Keyword } from './Keyword'

export class MovieTranslationData {
    @prop({ index: true, trim: true })
    title?: string

    @prop({ trim: true })
    overview?: string

    @prop({ trim: true })
    homepage?: string
}

export class MovieTranslation {
    @prop({ trim: true, minlength: 0, maxlength: 2 })
    iso_3166_1?: string

    @prop({ trim: true, minlength: 0, maxlength: 2 })
    iso_639_1?: string

    @prop({ trim: true })
    name?: string

    @prop({ _id: false })
    data?: MovieTranslationData
}

export class MovieTitle {
    @prop({ trim: true })
    iso_3166_1?: string

    @prop({ index: true, trim: true })
    title?: string

    @prop({ trim: true })
    type?: string
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Movie {
    @prop()
    adult?: boolean

    @prop({ trim: true })
    backdropPath?: string | null

    @prop()
    budget?: number

    @prop({ ref: Genre })
    genres?: Ref<Genre>[]

    @prop({ trim: true })
    homepage?: string | null

    @prop({ index: true, unique: true })
    tmdbId?: number

    @prop({ index: true, /* validate: /^tt[0-9]{7}/, */ minlength: 0, maxlength: 10, trim: true })
    imdbId?: string | null

    @prop({ trim: true, minlength: 0, maxlength: 2 })
    originalLang?: string

    @prop({ index: true, trim: true })
    originalTitle?: string

    @prop({ trim: true })
    overview?: string | null

    @prop({ index: true })
    popularity?: number

    @prop({ trim: true })
    posterPath?: string | null

    @prop({ ref: Company })
    productionCompanies?: Ref<Company>[]

    @prop({ type: String, innerOptions: { minlength: 0, maxlength: 2, trim: true } })
    productionCountries?: string[] // iso_3166_1

    @prop({ trim: true })
    releaseDate?: string

    @prop()
    revenue?: number

    @prop()
    runtime?: number | null

    @prop({ type: String, innerOptions: { minlength: 0, maxlength: 2, trim: true } })
    spokenLangs?: string[]  // iso_639_1

    @prop({ validate: {
        validator: (status) => {
            const statuses = [
                'Rumored',
                'Planned',
                'In Production',
                'Post Production',
                'Released',
                'Canceled'
            ]

            return statuses.includes(status)
        },
        message: 'invalid status'
    }, trim: true })
    status?: string

    @prop({ trim: true })
    tagline?: string | null

    @prop({ index: true, trim: true })
    title?: string

    @prop()
    voteAvg?: number

    @prop()
    voteCount?: number

    @prop({ type: MovieTitle, index: true, _id: false })
    titles?: MovieTitle[]

    @prop({ ref: Keyword, index: true })
    keywords?: Ref<Keyword>[]

    @prop({ type: MovieTranslation, _id: false })
    translations?: MovieTranslation[]

    public static async findOrCreate(
        this: ReturnModelType<typeof Movie>,
        // https://github.com/DefinitelyTyped/DefinitelyTyped/commit/88a54a939455efa0937b55ed507631415a574c44
        // Need to be fixed
        instance: Movie
    ) {
        //mongoLogger.debug(`Called findOrCreate(${instance}) of ${this.modelName}`)
        return await this.findOne({ tmdbId: instance.tmdbId }).exec() || await this.create(instance)
    }

    public static findByTMDB(
        this: ReturnModelType<typeof Movie>,
        tmdbId: Movie['tmdbId']
    ) {
        //mongoLogger.debug(`Called findByTMDB(${tmdbId}) of ${this.modelName}`)
        return this.findOne({ tmdbId })
    }

    public static findByIMDB(
        this: ReturnModelType<typeof Movie>,
        imdbId: Movie['imdbId']
    ) {
        //mongoLogger.debug(`Called findByIMDB(${imdbId}) of ${this.modelName}`)
        return this.findOne({ imdbId })
    }

    public static findLatest(
        this: ReturnModelType<typeof Movie>
    ) {
        //mongoLogger.debug(`Called findLatest() of ${this.modelName}`)
        return this.findOne().sort({ _id: -1 })
    }

    public static findLatestTMDB(
        this: ReturnModelType<typeof Movie>
    ) {
        //mongoLogger.debug(`Called findLatestTMDB() of ${this.modelName}`)
        return this.findOne().sort({ tmdbId: -1 })
    }
}
