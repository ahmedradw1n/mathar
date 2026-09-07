import { describe, it, expect } from 'vitest'
import { distanceBetweenPoints, midpoint, centroid, translatePoint, pointsEqual } from './points'
import { vectorBetweenPoints } from './vectors'

describe('points', () => {
  it('distanceBetweenPoints', () => {
    expect(distanceBetweenPoints({x:0,y:0,z:0},{x:3,y:4,z:0})).toBe(5)
    expect(distanceBetweenPoints({x:1,y:2,z:3},{x:1,y:2,z:3})).toBe(0)
    expect(distanceBetweenPoints({x:0,y:0,z:0},{x:1,y:2,z:2})).toBe(3)
  })
  it('midpoint', () => {
    expect(midpoint({x:0,y:0,z:0},{x:2,y:4,z:6})).toEqual({x:1,y:2,z:3})
  })
  it('centroid', () => {
    expect(centroid([{x:0,y:0,z:0},{x:3,y:0,z:0},{x:0,y:3,z:0}])).toEqual({x:1,y:1,z:0})
    expect(centroid([{x:0,y:0,z:0},{x:2,y:2,z:2}])).toEqual({x:1,y:1,z:1})
  })
  it('translatePoint — لا يخلط النقطة بالشعاع', () => {
    const p = {x:1,y:2,z:3}
    const v = {x:4,y:5,z:6}
    expect(translatePoint(p,v)).toEqual({x:5,y:7,z:9})
    // الشعاع بين نقطتين هو الفرق، وليس النقطة نفسها
    expect(vectorBetweenPoints({x:1,y:2,z:1},{x:4,y:5,z:3})).toEqual({x:3,y:3,z:2})
  })
  it('pointsEqual EPS', () => {
    expect(pointsEqual({x:1,y:2,z:3},{x:1+1e-10,y:2,z:3})).toBe(true)
    expect(pointsEqual({x:1,y:2,z:3},{x:1+1e-7,y:2,z:3})).toBe(false)
  })
})
