import store from '@/store'


const validateConnectionName = (rule, newValue, callback, source, options) => {
  if (options.edit && options.oldValue === newValue) {
    callback()
  }
  const duplicateName = store.state.connections.find($ => $.name === newValue)
  if (duplicateName) {
    callback(new Error('Duplicate Name'));
  }
  callback()
}

const validateClientId = (rule, newValue, callback, source, options) => {
  if (options.edit && options.oldValue === newValue) {
    callback()
  }
  const duplicateClientId = store.state.connections.find(
    $ => ($.clientId === newValue && $.host === options.connection.host),
  )
  if (duplicateClientId) {
    callback(new Error('Duplicate Client ID'));
  }
  callback()
}


export { validateConnectionName, validateClientId }
