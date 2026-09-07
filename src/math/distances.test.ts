import { describe, it, expect } from 'vitest'
import { distancePointLine, distancePointPlane } from './distances'
import type { Line3, Plane } from './types'

describe('distances', () => {
  it('distancePointLine', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:1,y:0,z:0} }
    expect(distancePointLine({x:0,y:3,z:4}, line)).toBeCloseTo(5)
  })
  it('distancePointPlane', () => {
    const plane: Plane = {a:0,b:0,c:1,d:0}
    expect(distancePointPlane({x:0,y:0,z:7}, plane)).toBeCloseTo(7)
  })
  it('distancePointPlane invalid → null', () => {
    const plane: Plane = {a:0,b:0,c:0,d:0}
    expect(distancePointPlane({x:0,y:0,z:7}, plane)).toBeNull()
  })
  it('distancePointLine zero direction → null', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:0,y:0,z:0} }
    expect(distancePointLine({x:1,y:0,z:0}, line)).toBeNull()
  })
})
