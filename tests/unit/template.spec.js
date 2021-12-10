import template from '@/assets/example.json'
import flat from '@/assets/flat.json'
import store from '@/store'

describe('Template manipulation', () => {
  it('Flattens the template', () => {
    expect(store.state.toFlat(template)).toMatchObject(flat)
  })
  it('Unflattens the template', () => {
    expect(store.state.toNested(flat)).toMatchObject(template)
  })
})
