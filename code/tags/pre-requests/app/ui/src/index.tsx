import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import { App } from "./Components/App";
import { createMuiTheme } from '@material-ui/core/styles';
import { createStore } from 'redux';
import { rootReducer } from "./Redux/Reducers/RootReducer";
import { Provider } from 'react-redux';

const theme = createMuiTheme({});
const store = createStore(rootReducer)

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById("root"),
);
