import React, { Component, ChangeEvent, DragEvent } from 'react'
import { observer } from 'mobx-react'
import BackupIcon from '@material-ui/icons/Backup'

import { Button } from '@material-ui/core'
import './drop-zone.scss'

interface DropZoneComponentProps {
    disabled?: boolean
    onFilesAdded: (files: any[]) => void
}


@observer
class DropZoneComponent extends Component<DropZoneComponentProps, any> {

    fileInputRef: React.RefObject<any>

    constructor(props: DropZoneComponentProps) {
        super(props)
        this.state = { hightlight: false }
        this.fileInputRef = React.createRef()

        this.openFileDialog = this.openFileDialog.bind(this)
        this.onFilesAdded = this.onFilesAdded.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onDragLeave = this.onDragLeave.bind(this)
        this.onDrop = this.onDrop.bind(this)
    }

  openFileDialog() {
    if (this.props.disabled) return
    this.fileInputRef.current.click()
  }

  onFilesAdded(evt: ChangeEvent<any>) {
    if (this.props.disabled) return
    const files = evt.target.files
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files)
      this.props.onFilesAdded(array)
    }
  }

  onDragOver(evt: DragEvent<HTMLDivElement>) {
    evt.preventDefault()

    if (this.props.disabled) return

    this.setState({ hightlight: true })
  }

  onDragLeave() {
    this.setState({ hightlight: false })
  }

  onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()

    if (this.props.disabled) return

    const files = event.dataTransfer!.files
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files)
      this.props.onFilesAdded(array)
    }
    this.setState({ hightlight: false })
  }

  fileListToArray(list: any) {
    const array = []
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i))
    }
    return array
  }

  render() {
    return (
      <div
        className={`drop-zone-component ${this.state.hightlight ? 'highlight' : ''}`}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onClick={this.openFileDialog}
        style={{ cursor: this.props.disabled ? 'default' : 'pointer' }}
      >
        <input
          ref={this.fileInputRef}
          className='file-input'
          type='file'
          accept='image/png, image/jpeg'
          onChange={this.onFilesAdded}
        />
        <BackupIcon />

        <Button>Load image</Button>
      </div>
    )
  }
}

export default DropZoneComponent