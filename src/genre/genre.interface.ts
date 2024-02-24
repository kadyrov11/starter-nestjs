import { Types } from "mongoose"

export interface ICollection {
    _id: Types.ObjectId
    image: string
    title: string
    slug: string
}