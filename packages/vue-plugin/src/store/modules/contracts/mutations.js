export const UPDATE_CONTRACT = (state, { contractName, contract }) =>
  (state.instances = { ...state.instances, [contractName]: contract })

export const SET_CACHEKEY = (state, { contractName, method, cacheKey }) => {
  const pair = { [method]: [cacheKey] }
  if (!state.cacheKeys[contractName]) {
    state.cacheKeys = { ...state.cacheKeys, [contractName]: { ...pair } }
  } else {
    if (!state.cacheKeys[contractName][method]) {
      state.cacheKeys[contractName][method] = [cacheKey]
    } else {
      if (!state.cacheKeys[contractName][method].includes(cacheKey)) {
        state.cacheKeys[contractName][method].push(cacheKey)
      }
    }
  }
}
