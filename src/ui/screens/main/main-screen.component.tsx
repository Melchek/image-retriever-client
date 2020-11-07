import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import { RouteProps } from 'react-router'
import { WithTranslation, withTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import MainStore from '../../../stores/main.store'
import LoadImagesModalComponent from '../../components/add-images/load-images.component'

import ResultDialog from '../../components/result-image/result-dialog.component'
import StartButton from '../../components/start-button/start-button.component'
import './main.style.scss';

interface MainScreenProps extends RouteProps, WithTranslation {
  mainStore?: MainStore
}

@inject((stores) => ({
  mainStore: (stores as any).mainStore as MainStore
}))
@observer
class MainScreen extends Component<MainScreenProps, any> {

  onStartPressed = () => {
    this.props.mainStore!.setIsLoadingImages(true)
  }

  onResultDialogClosed = () => {
    this.props.mainStore!.setIsResultDisplayed(false)
  }

  render() {
    const { mainStore } = this.props
    const { isResultDisplayed } = mainStore!

    return (
      <Grid container
        alignItems={'center'}
        direction={'column'}
        className='main-screen'>
        <Grid item className='content'>
          {/* {isLoading && <CircularProgress color='secondary' />} */}
          <LoadImagesModalComponent onAdded={() => { }} />
          <StartButton onStartPressed={this.onStartPressed} />
          {!!isResultDisplayed && <ResultDialog onClose={this.onResultDialogClosed}/>}

        </Grid>
      </Grid>
    )
  }
}

export default withTranslation('mainScreen')(MainScreen)
