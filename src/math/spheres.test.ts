import { describe, it, expect } from 'vitest'
import { spherePlaneRelation } from './spheres'

describe('spheres', () => {
  it('spherePlaneRelation', () => {
    const sphere = { center:{x:0,y:0,z:0}, radius: 2 }
    expect(spherePlaneRelation(sphere, {a:0,b:0,c:1,d:-5})).toBe('outside') // d=5>r
    expect(spherePlaneRelation(sphere, {a:0,b:0,c:1,d:-2})).toBe('tangent') // d=2
    expect(spherePlaneRelation(sphere, {a:0,b:0,c:1,d:0})).toBe('intersecting')
  })
})
