import React from 'react'

import { observer, Provider } from 'mobx-react'
import { Router, Route } from 'react-router-dom'

import {
  MuiThemeProvider
} from '@material-ui/core'

import { createMuiTheme } from '@material-ui/core/styles'
import { RouterProps } from 'react-router'

import history from './utils/history'

import MainScreen from './ui/screens/main/main-screen.component'
import { initClient } from './utils/client/base.client'

import './App.scss'
import MainStore from './stores/main.store'

const theme = createMuiTheme({
  typography: {
  },
  palette: {
    primary: {
      main: '#235c76',
    },
    secondary: {
      main: '#45a886',
    },
  },
})

const mainStore = new MainStore()

const stores = {
  mainStore
}

interface AppProps extends Partial<RouterProps> { }

@observer
class App extends React.Component<AppProps, any> {

  constructor(props: AppProps) {
    super(props)
    initClient()
  }
  render() {
    const { isRtl } = mainStore

    return (
      <div dir={isRtl ? 'rtl' : 'ltr'}>
        <MuiThemeProvider theme={theme}>
          <Provider {...stores}>
            <Router history={history}>
              <Route exact path='/' component={MainScreen} />
            </Router>
          </Provider>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App
