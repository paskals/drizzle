export const contractInstances = state => state.instances

export const getContractData = (state, _, rootState) => options => {
  const {
    contract,
    method,
    methodArgs,
    toUtf8,
    toAscii,
    toWad,
    toNumberString,
    toAddress
  } = options
  var argsHash = '0x0'
  var args = methodArgs ? methodArgs : []

  const drizzleInstance = rootState.drizzle.drizzleInstance
  const web3 = drizzleInstance.web3

  if (args.length > 0) {
    argsHash = generateArgsHash(args, web3)
  }

  const instance = state.instances[contract]
  const cacheKey = state.cacheKeys[contract] ? argsHash : null

  // Reduce multiple states to `loading`
  if (
    cacheKey === null ||
    instance === undefined ||
    !instance.initialized ||
    !web3.utils
  )
    return 'loading'

  const cachedData = instance[method][cacheKey]
  if (cachedData === undefined) return 'loading'

  let { value } = cachedData
  const {
    hexToUtf8,
    hexToAscii,
    fromWei,
    hexToNumberString,
    toChecksumAddress
  } = drizzleInstance.web3.utils
  return toUtf8
    ? hexToUtf8(value)
    : toAscii
    ? hexToAscii(value)
    : toNumberString
    ? hexToNumberString(value)
    : toWad
    ? fromWei(hexToNumberString(value))
    : toAddress
    ? toChecksumAddress('0x' + value.slice(26, 66))
    : value
}

function generateArgsHash(args, web3) {
  var hashString = ''

  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] !== 'function') {
      var argToHash = args[i]

      // Stringify objects to allow hashing
      if (typeof argToHash === 'object') {
        argToHash = JSON.stringify(argToHash)
      }

      // Convert number to strong to allow hashing
      if (typeof argToHash === 'number') {
        argToHash = argToHash.toString()
      }
      var hashPiece = ''
      // This check is in place for web3 v0.x
      if ('utils' in web3) {
        hashPiece = web3.utils.sha3(argToHash)
      } else {
        hashPiece = web3.sha3(argToHash)
      }

      hashString += hashPiece
    }
  }

  return web3.utils.sha3(hashString)
}
