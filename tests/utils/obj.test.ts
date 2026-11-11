import { describe, it, expect } from "vitest";
import { mergeSerializableValue, SerializableObject, SerializableValue, deepCopy } from "../../src";

describe('object utils test', ()=>{
    it('merge object', ()=>{
        let a: SerializableObject = {
            name: 'eric',
            age: 10,
            gm: false,
        }
        let b: SerializableObject = {
            uid: 1,
            ids:[1, 2, 3],
            info: [
                {
                    game: "m3"
                }
            ]
        }
        const x = mergeSerializableValue(b, a) as SerializableObject;
        expect(x.name).toBe("eric");
        expect(x.age).toBe(10);

        expect((mergeSerializableValue([1,2], []) as number[]).join()).equals([1,2].join())
    })

    it('merge primitive', ()=>{
        expect(mergeSerializableValue(1, 2)).toBe(1);
        expect(mergeSerializableValue("eric", "zero")).toBe("eric")
        expect(mergeSerializableValue(1, false)).toBe(1)
        expect(mergeSerializableValue(null, {})).toBeNull()
    })

    it('merge reference', ()=>{
        expect(mergeSerializableValue({
            a:1, nested:{x:1, y:2}
        }, {b: 2, nested: {y:3, z:4}})).toEqual({a:1, b:2, nested:{x:1, y:3,z:4}})
    });

    it('deep copy', ()=>{
        const obj = {
            a: 1,
            b: "string",
            d: [1, 2, 3],
            f: { g: "nested" }
        };

        const copy = deepCopy(obj);

        expect(copy).toEqual(obj);
        expect(copy).not.toBe(obj);
        expect(copy.d).not.toBe(obj.d);
        expect(copy.f).not.toBe(obj.f);

        expect(copy.b).toBe(obj.b);

        expect(copy.d.join(',')).toBe(obj.d.join(','));

        expect(copy.f.g).toBe(obj.f.g);

        expect(copy.f).toEqual(obj.f);
    });

    it('complex object', ()=>{
        const o = {id:1, game:[1,2,"3"],info:{
            1: [{
                goods: [1, "2", "3", true, 1.2],
                task: {
                    "1": "ddd",
                    "desc": "sss",
                    "level": 10
                }
            }]
        }}
        const c = deepCopy(o);
        expect(c.info[1].at(0)?.goods.at(-1)).toBe(1.2)
        expect(c.info[1].at(0)?.task.level).toBe(10)
    })
})