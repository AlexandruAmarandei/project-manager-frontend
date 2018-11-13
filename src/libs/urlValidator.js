
export function validateLink(link) {
    let position;
    for(position = 0; position < link.length;position++){
        console.log(link[position]);
        let good = false;
        if(link[position] >= "a" && link[position] <="z"){
            good = true;
        }
        if(link[position] >= "A" && link[position] <="Z"){
            good = true;
        }
        if(link[position] === " " || link[position] === "-"){
            good = true;
        }
        if(link[position] === "@" || link[position] ==="."){
            good = true;
        }
        console.log(good);
        if(good === false){
            return false;
        }
    }
    return true;
}