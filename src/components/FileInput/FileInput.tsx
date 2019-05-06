import * as React from 'react'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Uppy from '@uppy/core'
import { DashboardModal } from '@uppy/react'
import { Button } from '../Button'
import { UPPY_CONFIG } from './UppyConfig'
import { FlexContainer } from '../Layout/FlexContainer'
import theme from 'src/themes/styled.theme'
import Text from '../Text'
import { FileInfo } from '../FileInfo/FileInfo'

interface IUppyFiles {
  [key: string]: Uppy.UppyFile<{}>
}
interface IProps {
  onFilesChange?: (files: (Blob | File)[]) => void
}
interface IState {
  open: boolean
}
export class FileInput extends React.Component<IProps, IState> {
  private uppy = Uppy({
    ...UPPY_CONFIG,
    onBeforeUpload: () => this.uploadTriggered(),
  })
  constructor(props: IProps) {
    super(props)
    this.state = { open: false }
  }
  get files() {
    const files = this.uppy.getState().files as IUppyFiles
    return files
  }
  get filesArray() {
    return Object.values(this.files).map(meta => meta.data) as File[]
  }

  // when upload button clicked just want to clise modal and reflect files
  uploadTriggered() {
    this.toggleModal()
    return this.files
  }

  toggleModal() {
    this.setState({
      open: !this.state.open,
    })
    this.triggerCallback()
  }
  // reflect changes to current files whenever modal open or closed
  triggerCallback() {
    if (this.props.onFilesChange) {
      this.props.onFilesChange(this.filesArray)
    }
  }
  // TODO - split into own component
  renderFilePreview(file: File) {
    return <div key={file.name}>{file.name}</div>
  }

  render() {
    const showFileList = this.filesArray.length > 0
    return (
      <div
        style={{
          border: `1px solid ${theme.colors.grey}`,
          width: '380px',
        }}
      >
        <FlexContainer flexDirection="column" justifyContent="center">
          <Text regular textAlign="center" mb={2}>
            Additional Files
          </Text>
          {showFileList ? (
            <>
              <Button
                onClick={() => this.toggleModal()}
                icon="upload"
                variant="outline"
              />
              {this.filesArray.map(file => (
                <FileInfo key={file.name} file={file} />
              ))}
            </>
          ) : (
            <Button
              icon="upload"
              onClick={() => this.toggleModal()}
              type="button"
              variant="outline"
            >
              Upload Files
            </Button>
          )}
          <DashboardModal
            proudlyDisplayPoweredByUppy={false}
            uppy={this.uppy}
            open={this.state.open}
            onRequestClose={() => this.toggleModal()}
          />
        </FlexContainer>
      </div>
    )
  }
}