

export class PrismaHelper {
    static  idsToObjects<T>(ids:T[]) : {id:T}[] {
        return ids?.map((v)=>{return {id:v}})
    }
}