import { describe, it, expect } from "vitest";
import { Singleton } from "../../src";

describe('singleton', ()=>{
    it('single instance', ()=>{
        class Foo{
            id: number = Math.random();
        }
        const FooSingleton = Singleton(Foo);
        const a = new FooSingleton()
        const b = new FooSingleton();
        expect(a).toBe(b);
        expect(a.id).toBe(b.id);
    });
})