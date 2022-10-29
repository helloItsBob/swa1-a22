import { Store } from '@reduxjs/toolkit';
import * as React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux'
import { Game, otherPlayer, Player } from './model';
import { State, Dispatch } from './store';
import { joinGameThunk, makeMoveThunk, newGameThunk } from './thunks';
import './view.css';

const Board = ({enabled}: {enabled: boolean}) => {
  const gameState = useSelector((s: State) => s.game)
  const {board} = gameState.game
  const dispatch: Dispatch = useDispatch()
  return (
    <table>
      <tbody>
        { board.map((row, x) =>
            <tr key={x}>{ row.map((tile, y) => {
              if (tile)
                return <td key = {x + '' + y} className = { tile }/>
              else if (enabled)
                return <td key = {x + '' + y} className = {'blank'} onClick = {() => dispatch(makeMoveThunk(x, y))}/>
              else
              return <td key = {x + '' + y} className = {'inert'}/>
            })
            }</tr>
        )}
      </tbody>
    </table>
  )
}

const Lobby = () => {
  const games = useSelector((s: State) => s.lobby)
  const dispatch: Dispatch = useDispatch()

  return (
    <div>
      <h1>Lobby</h1>
      {
        games.map(({gameNumber}) => 
          <div key={gameNumber}>
            Game {gameNumber}
            <button className = 'join' onClick = {() => dispatch(joinGameThunk(gameNumber))} >Join</button>
          </div>)
      }
      <button id = 'new' onClick={() => dispatch(newGameThunk)}>New game</button>
    </div>
  )
}

const WaitingForGame = () => (
  <div>
    <h1>Waiting for other player...</h1>
  </div>
)

const Active = () => {
  const {player} = useSelector((s: State) => s.game)
  return <div>
    <h2>Your turn, { player }</h2>
    <Board enabled = {true}/>
  </div>
}

const WaitingForTurn = () => {
  const {player} = useSelector((s: State) => s.game)
  return <div>
    <h2>Waiting for { otherPlayer(player) }</h2>
    <Board enabled = {false}/>
  </div>
}

const GameOver = () => {
  const {game} = useSelector((s: State) => s.game)
  return <div>
    <h1>Game {game.gameNumber} complete</h1>
    <h2>{game.stalemate? 'Stalemate' : game.winState.winner + ' won'}</h2>
    <Board enabled = {false}/>
  </div>
}

const Playing = () => {
  const {game, player} = useSelector((s: State) => s.game)
  return <div>
    <h1>Playing game {game.gameNumber}</h1>
    {game.inTurn === player? <Active/> : <WaitingForTurn/>}
  </div>
}

const GamePage = () => {
  const {game} = useSelector((s: State) => s.game)
  if (game.winState || game.stalemate)
    return <GameOver/>
  else
    return <Playing/>
}

const Page = () => {
  const gameState = useSelector((s: State) => s.game)
  switch(gameState.mode) {
    case 'no game':
      return <Lobby/>
    case 'waiting':
      return <WaitingForGame/>
    case 'playing':
      return <GamePage/>
  }
}

export const View = (store: Store<State>) =>
<Provider store={store}>
  <Page></Page>
</Provider>

/*
const Message = ({status: {winner, inTurn, stalemate, ongoing}, player}) => {
  if (winner)
  return <p>{winner.winner} won!</p>
  else if (stalemate)
  return <p>Stalemate!</p>
  else if (!ongoing || player !== inTurn) 
  return <p>Waiting for player...</p>
  else    
  return <p>Your turn, {inTurn}</p>
}        

const Board = ({ game: { board, gameNumber }, dispatch, player }) =>
<table>
<tbody>
{board.map((row, x) =>
          <tr key={x}>{row.map ( (tile, y) => 
            <td key={x+''+y}
            className={tile || 'blank'}
            onClick= {() => dispatch({type:'move', x, y, player, gameNumber })}/>)
          }</tr>
          )}
          </tbody>
          </table>
          
          const GamesList = ({ games, dispatch }) => (
            <div>
            {games.map(({gameNumber}) => 
            <div 
            key={gameNumber}
            onClick={() => dispatch({type: 'join', gameNumber})}>
            Game {gameNumber}
            </div>)}
            </div>
            )
            
            const game_list_view = dispatch => ({ games }) => 
            <div>
            <h1>Choose game</h1>
            <GamesList games={games} dispatch = {dispatch} />
            <button id = 'new' onClick = { () => dispatch({type: "new"})}>New game</button>
            </div>
            
            
            const game_view = dispatch => ({ game, player }) => 
<div> 
      <h1>Tic-tac-toe</h1>
      <Message status = {game} player = {player} />
      {
        (game.ongoing)?
        <Board game={game} dispatch = {dispatch} player = {player} />
        : <div></div>
      }
      <button id = 'concede' 
      onClick = {() => 
        dispatch({
          type: "concede", 
          player: player, 
          gameNumber: game.gameNumber})}>
          Concede
          </button>
          </div>
          
          const View = ({ state, dispatch }) => state.accept({
            visit_pre_game: game_list_view(dispatch),
            visit_game: game_view(dispatch)
          })
          
          
          const render = dispatch => state => ReactDOM.render(<View state={ state } dispatch = {dispatch} />, document.getElementById('root'));
          
          export default render;
          
*/