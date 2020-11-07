
import React, { useRef, useEffect } from 'react'

import { inject, observer } from 'mobx-react'

import { RouteProps } from 'react-router'
import { WithTranslation, withTranslation } from 'react-i18next'

import { ButtonBase, Typography } from '@material-ui/core'

import lensLogo from './../../../assets/images/lens.jpg'

import MainStore from '../../../stores/main.store'

import './start-button.style.scss'

interface StartButtonProps extends RouteProps, WithTranslation {
    mainStore?: MainStore
    onStartPressed: () => void
}

const StartButton = inject('mainStore')(
    observer((props: StartButtonProps) => {
        const { t, onStartPressed } = props

        const buttonRef = useRef<HTMLButtonElement>(null)

        useEffect(() => {
            if (buttonRef?.current) {
                buttonRef.current!.focus()
            }
        })

        return <ButtonBase
            ref={buttonRef}
            focusRipple
            key={'start-button'}
            className='start-button'
            focusVisibleClassName='focus-visible'
            onClick={onStartPressed}
        >
            <span
                className='image-src'
                style={{
                    backgroundImage: `url(${lensLogo})`,
                }}
            />
            <span className='image-backdrop' />
            <span className='image-button'>
                <Typography
                    component="h5"
                    variant="button"
                    color="inherit"
                    className='image-title'
                >
                    {t('start')}
                    <span className='image-marked' />
                </Typography>
            </span>
        </ButtonBase>

    })
)

export default withTranslation('startButton')(StartButton)
