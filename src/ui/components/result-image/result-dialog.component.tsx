import React from 'react'
import { observer } from 'mobx-react'

import {
    Dialog,
    DialogContent,
} from '@material-ui/core'

import ResultImage from './result-image.component'

interface ResultDialogProps {
    onClose: () => void
}

const ResultDialog = observer((props: ResultDialogProps) => {
    return (
        <Dialog onClose={props.onClose} aria-labelledby='customized-dialog-title'
            open={true} className='result-dialog'>
            <DialogContent className='dialog-content'>
                <ResultImage />
            </DialogContent>
        </Dialog>
    )
})

export default ResultDialog
