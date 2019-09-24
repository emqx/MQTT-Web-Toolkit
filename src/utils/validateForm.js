import store from '@/store'


const validateConnectionName = (rule, newValue, callback, source, options) => {
  if (options.edit && options.oldValue === newValue) {
    callback()
  }
  const duplicateName = store.state.connections.filter($ => $.name === newValue)
  if (duplicateName.length > 0) {
    callback(new Error('Duplicate Name'));
  }
  callback()
}

const validateClientId = (rule, newValue, callback, source, options) => {
  if (options.edit && options.oldValue === newValue) {
    callback()
  }
  const duplicateClientId = store.state.connections.filter($ => $.clientId === newValue)
  if (duplicateClientId.length > 0) {
    callback(new Error('Duplicate Client ID'));
  }
  callback()
}


export { validateConnectionName, validateClientId }
