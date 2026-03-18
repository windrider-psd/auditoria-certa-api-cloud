import yn from "yn";

export function ProcessQuery(q:any){
    
    for(const key in q){
        if(!isNaN(q[key])){
            q[key] = Number(q[key])
            continue
        }
        const result = yn(q[key] as string)
        if(result != undefined){
            q[key] = result
        }
    }
    return q
}