import { describe, it, expect } from 'vitest'
import { dot, length, angleBetween, angleBetweenDeg, areOrthogonal, areParallel, projectVectorOnto, vectorBetweenPoints } from './vectors'

describe('audit stage2 math', () => {
  it('vectorBetweenPoints: AB = B - A', () => {
    expect(vectorBetweenPoints({x:1,y:2,z:1},{x:4,y:5,z:3})).toEqual({x:3,y:3,z:2})
    expect(vectorBetweenPoints({x:0,y:0,z:0},{x:0,y:0,z:0})).toEqual({x:0,y:0,z:0})
  })
  it('length examples', () => {
    expect(length({x:3,y:4,z:0})).toBe(5)
    expect(length({x:3,y:4,z:12})).toBe(13)
    expect(length({x:0,y:0,z:0})).toBe(0)
  })
  it('dot sign', () => {
    expect(dot({x:1,y:0,z:0},{x:1,y:0,z:0})).toBeGreaterThan(0) // حادة
    expect(dot({x:1,y:0,z:0},{x:-1,y:0,z:0})).toBeLessThan(0) // منفرجة
    expect(dot({x:1,y:0,z:0},{x:0,y:1,z:0})).toBe(0) // قائمة
    expect(dot({x:0,y:0,z:0},{x:1,y:2,z:3})).toBe(0) // صفري
  })
  it('angle clamp for floating errors', () => {
    // almost parallel due to floating
    const a = {x:1,y:0,z:0}
    const b = {x:1+1e-12,y:0,z:0}
    const ang = angleBetween(a,b)
    expect(ang).toBeCloseTo(0)
    // dot slightly >1 due to error, must clamp
    const cos = dot(a,b)/(length(a)*length(b))
    expect(Math.abs(cos) <= 1.0000001).toBe(true)
    expect(angleBetweenDeg(a,b)).toBeCloseTo(0)
    // opposite
    expect(angleBetweenDeg({x:1,y:0,z:0},{x:-1,y:0,z:0})).toBeCloseTo(180)
  })
  it('orthogonal with EPS', () => {
    expect(areOrthogonal({x:1,y:0,z:0},{x:0,y:1,z:0})).toBe(true)
    expect(areOrthogonal({x:1,y:0,z:0},{x:1e-10,y:1,z:0},1e-9)).toBe(true)
    expect(areOrthogonal({x:0,y:0,z:0},{x:1,y:0,z:0})).toBe(false) // صفر لا يعتبر متعامد
  })
  it('parallel', () => {
    expect(areParallel({x:2,y:4,z:6},{x:1,y:2,z:3})).toBe(true) // نفس الاتجاه
    expect(areParallel({x:2,y:4,z:6},{x:-1,y:-2,z:-3})).toBe(true) // عكس
    expect(areParallel({x:1,y:0,z:0},{x:0,y:1,z:0})).toBe(false)
    expect(areParallel({x:0,y:0,z:0},{x:1,y:0,z:0})).toBe(false) // صفري
  })
  it('projection', () => {
    expect(projectVectorOnto({x:3,y:4,z:0},{x:1,y:0,z:0})).toEqual({x:3,y:0,z:0})
    expect(projectVectorOnto({x:3,y:0,z:0},{x:0,y:0,z:0})).toEqual({x:0,y:0,z:0}) // b صفر → صفر
    // orthogonal → صفر
    expect(projectVectorOnto({x:0,y:5,z:0},{x:5,y:0,z:0})).toEqual({x:0,y:0,z:0})
  })
})
