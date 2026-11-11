import {describe, it, expect} from 'vitest';
import {stringToDate, dateToString} from '../../src/index'

describe('date utils', ()=>{
    it('check day', ()=>{
        const d = dateToString(new Date(2024,0,1,12,30,45), "%Y/%m/%d");
        expect(d).toBe("2024/01/01")
    });

    it('check datetime', ()=>{
        const d = dateToString(new Date(2024,0,1,12,30,24));
        expect(d).toBe("2024-01-01 12:30:24")
    });

    it('should equal', ()=>{
        const now = Math.ceil(Date.now()/1000);
        expect(Math.ceil(stringToDate(dateToString(new Date(now*1000))).getTime())/1000).toBe(now);
    })
})