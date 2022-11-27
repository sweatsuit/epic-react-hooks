import {useEffect, useState, useRef} from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const prevKeyRef = useRef(key)
  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  useEffect(() => {
    if (key !== prevKeyRef.current) {
      window.localStorage.removeItem(prevKeyRef.current)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

export default useLocalStorageState

// Usestate:
// set 1. check if existing and return deserialze
// get 2 check if function & return run or return default value

// Setstate
// 1. serialize state value
