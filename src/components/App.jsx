import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { createUseStyles } from 'react-jss';
import useWebSockets from 'hooks/useWebSockets';
import apiActions from 'core/api/actions';
import webSocketsActions from 'core/webSockets/actions';
import Login from 'components/Login';

const useStyles = createUseStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      background: 'black',
      color: 'green',
      fontFamily: 'Verdana',
      fontSize: 14,
      margin: 0,
      overflowY: 'hidden',
      padding: 0,
    },
  },
  active: {
    background: '#fff',
  },
  column: {
    alignItems: 'center',
    borderBottom: '2px solid #111',
    borderRight: '2px solid #111',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  grid: {
    '&:focus': {
      outline: 'none',
    },
    borderLeft: '2px solid #111',
    borderTop: '2px solid #111',
    display: 'flex',
    flexDirection: 'column-reverse',
    height: '100vh',
    maxHeight: '100%',
    padding: 0,
    width: '100vw',
  },
  row: {
    alignItems: 'stretch',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'row',
    width: '100%',
  },
});

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  const grid = [...Array(40)].fill([...Array(80)]);

  const client = useWebSockets();
  console.log('asdfasfasdfasdf');
  if (client) {
    client.onerror = () => {
      console.log('Connection Error');
      // dispatch(webSocketsActions.onerror(rs));
    };
    client.onclose = () => {
      console.log('WebSocket Client Disconnected');
      // dispatch(webSocketsActions.onclose(rs));
    };
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      // dispatch(webSocketsActions.onopen(rs));
    };
    client.onmessage = (rs) => {
      const data = JSON.parse(rs.data);
      dispatch(webSocketsActions.onmessage(data));
    };
  }

  const hasActivePlayer = (x, y) => {
    return Object.keys(users).find(
      (id) => users[id].position.x === x && users[id].position.y === y,
    );
  };
  const loggedIn = false;
  if (!loggedIn) {
    return <Login />;
  }

  return (
    <div
      tabIndex="0"
      role="textbox"
      className={classes.grid}
      onKeyPress={(e) => {
        if (e.key === 'w') {
          dispatch(apiActions.moveUp(client));
        } else if (e.key === 's') {
          dispatch(apiActions.moveDown(client));
        } else if (e.key === 'a') {
          dispatch(apiActions.moveLeft(client));
        } else if (e.key === 'd') {
          dispatch(apiActions.moveRight(client));
        }
      }}
    >
      {grid.map((row, y) => (
        <div className={classes.row} key={y}>
          {row.map((column, x) => (
            <div
              className={classnames(classes.column, {
                [classes.active]: hasActivePlayer(x, y),
              })}
              key={x}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
