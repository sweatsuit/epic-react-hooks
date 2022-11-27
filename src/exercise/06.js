// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {hasError: false}
//   }

//   static getDerivedStateFromError(error) {
//     return {hasError: true}
//   }

//   componentDidCatch(error, info) {}

//   render() {
//     if (this.state.hasError) {
//       return <h1>The following error occured: {error.message}</h1>
//     }

//     return this.props.children
//   }
// }

function ErrorFallback({error}) {
  return <h1>The following error occured: {error.message}</h1>
}

function PokemonInfo({pokemonName}) {
  const [pokemonState, setPokemonState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = pokemonState

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setPokemonState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setPokemonState({status: 'resolved', pokemon})
      },
      error => {
        setPokemonState({status: 'rejected', error})
      },
    )
  }, [pokemonName])
  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  } else if (status === 'rejected') {
    throw error
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={pokemonName}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
