import { RateMethod } from '../types/RateMethod'
import { RateStorageState } from '../types/RateStorageState'
import { StorageKey } from '../types/StorageKey'
import { isRateValid } from './isRateValid'
import { parseJsonSafe } from './parseJsonSafe'

const defaultState: RateStorageState = {
  rate: 1,
  method: RateMethod.multiply
}
const updateListeners: ((state: RateStorageState) => unknown)[] = []
export const RateStorage = {
  get(): RateStorageState {
    const storedJSON = localStorage.getItem(StorageKey.rate)
    const stateParsedUnsafe = storedJSON && parseJsonSafe<RateStorageState>(storedJSON)
    if (typeof stateParsedUnsafe !== 'object') return defaultState
    const rateStored = stateParsedUnsafe?.rate
    const rate = rateStored && isRateValid(rateStored) ? rateStored : defaultState.rate
    const isMethodValid = (Object.values(RateMethod) as unknown[]).includes(
      stateParsedUnsafe?.method
    )
    const method = isMethodValid ? (stateParsedUnsafe?.method as RateMethod) : defaultState.method
    return { rate, method }
  },
  set(state: RateStorageState) {
    localStorage.setItem(StorageKey.rate, JSON.stringify(state))
    updateListeners.forEach((listener) => listener(state))
  },
  subscribe(listener: (state: RateStorageState) => unknown) {
    updateListeners.push(listener)
    return () => updateListeners.splice(updateListeners.indexOf(listener), 1)
  }
}
