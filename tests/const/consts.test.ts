import { describe, it, expect } from "vitest";

import { SerializableArray, SerializableKey, SerializableObject, 
    SerializablePrimitive, SerializableValue } from "../../src";

describe("consts test unit", ()=>{
    it('check obj', ()=>{
        let base: SerializableObject = {
            head_url: "",
            gender: 1,
            nick: "eric"
        }
        let obj: SerializableObject = {
            id: 1,
            name: "eric",
            level: 1,
            gm: false,
            base_info: base
        }
        expect(obj.name).toBe("eric")
        expect(obj.base_info).toBe(base)
    })
})