import * as gs from '../src/index';
class User{
    name: string = ""
    age: number = 0
}

@gs.Singleton
class ElementData {
    id: number = 0
    
}

class Board{

}

const c = gs.deepCopy({id:1, game:[1,2,"3"],info:{
    1: [{
        goods: [1, "2", "3", true, 1.2],
        task: {
            "1": "ddd",
            "desc": "sss",
            "level": 10
        }
    }]
}});

console.log(c);
console.log(JSON.stringify(c));
