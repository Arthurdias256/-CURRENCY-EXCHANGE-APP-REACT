import { describe, expect, it } from 'vitest'
import {
  getCurrencyFlag,
  getCurrencyFlagImageUrl,
} from './currencyFlags.js'

describe('getCurrencyFlag', () => {
  it.each([
    ['BRL', '🇧🇷'],
    ['USD', '🇺🇸'],
    ['JPY', '🇯🇵'],
    ['EUR', '🇪🇺'],
  ])('returns the representative flag for %s', (currencyCode, expectedFlag) => {
    expect(getCurrencyFlag(currencyCode)).toBe(expectedFlag)
  })

  it('returns a neutral globe for currencies without a unique country flag', () => {
    expect(getCurrencyFlag('XDR')).toBe('🌐')
  })

  it('returns an image URL for a mapped currency and no URL for an unmapped one', () => {
    expect(getCurrencyFlagImageUrl('BRL')).toBe(
      'https://flagcdn.com/w40/br.png',
    )
    expect(getCurrencyFlagImageUrl('XDR')).toBeNull()
  })
})
