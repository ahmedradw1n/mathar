import { describe, it, expect } from 'vitest'
import { add, sub, scale, length, normalize, projectVectorOnto, lerp } from './vectors'

describe('vectors extra', () => {
  it('scale with negative flips direction', () => {
    expect(scale({x:1,y:2,z:3}, -2)).toEqual({x:-2,y:-4,z:-6})
    expect(scale({x:1,y:0,z:0}, 0)).toEqual({x:0,y:0,z:0})
  })
  it('add/sub chain', () => {
    const a={x:1,y:2,z:3}, b={x:4,y:5,z:6}
    expect(sub(add(a,b), b)).toEqual(a)
  })
  it('projectVectorOnto', () => {
    const a={x:3,y:4,z:0}, b={x:1,y:0,z:0}
    expect(projectVectorOnto(a,b)).toEqual({x:3,y:0,z:0})
    expect(projectVectorOnto(a,{x:0,y:0,z:0})).toEqual({x:0,y:0,z:0})
  })
  it('normalize zero', () => {
    expect(normalize({x:0,y:0,z:0})).toEqual({x:0,y:0,z:0})
    const n=normalize({x:3,y:4,z:0})
    expect(length(n)).toBeCloseTo(1)
  })
  it('lerp', () => {
    expect(lerp({x:0,y:0,z:0},{x:2,y:2,z:2},0.5)).toEqual({x:1,y:1,z:1})
  })
})
