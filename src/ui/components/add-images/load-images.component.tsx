import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { inject, observer } from 'mobx-react';

import { withTranslation, WithTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';

import { compressToDataUrl } from '../../../utils/image.utils';
import DropZoneComponent from '../dropzone/dropzone.component';
import MainStore from '../../../stores/main.store';
import './load-images.style.scss';

interface LoadImagesProps extends WithTranslation {
  onAdded: () => void;
  mainStore?: MainStore;
}

enum StepsEnum {
  image,
  queryImage,
}

@inject((stores) => ({
  mainStore: (stores as any).mainStore as MainStore,
}))
@observer
class LoadImagesModalComponent extends Component<LoadImagesProps, any> {
  @observable activeStep = StepsEnum.image;
  skippedSet = new Set();

  steps: string[];

  @observable isLoading = false;

  @observable image = '';
  imageFile: File | undefined;
  @observable queryImage = '';
  queryImageFile: File | undefined;

  constructor(props: LoadImagesProps) {
    super(props);
    makeObservable(this);
    this.steps = [props.t('steps.image'), props.t('steps.queryImage')];
  }

  onCancel = () => {
    this.props.mainStore!.setIsLoadingImages(false);
  };

  @action.bound
  onFinish = async () => {
    this.isLoading = true;

    try {
      await this.props.mainStore!.uploadImages(
        this.imageFile!,
        this.queryImageFile!,
        this.image,
        this.queryImage,
      );
      this.props.onAdded();
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
      // reset modal
      this.activeStep = StepsEnum.image;
      this.image = '';
      this.queryImage = '';
      this.imageFile = undefined;
      this.queryImageFile = undefined;
    }
  };

  isStepOptional = (step: StepsEnum) => {
    return false;
  };

  isStepSkipped = (step: number) => {
    return this.skippedSet.has(step);
  };

  isNextDisabled = (activeStep: StepsEnum) => {
    return activeStep === StepsEnum.image && !this.image;
  };

  @action setActiveStep = (step: number) => {
    this.activeStep = step;
  };

  setSkipped = (step: number) => {
    this.skippedSet.add(step);
  };

  handleNext = () => {
    if (this.isStepSkipped(this.activeStep)) {
      this.skippedSet.delete(this.activeStep);
    }

    if (this.activeStep === this.steps.length - 1) {
      this.onFinish();
    } else {
      this.setActiveStep(this.activeStep + 1);
    }
  };

  handleBack = () => {
    this.setActiveStep(this.activeStep - 1);
  };

  handleSkip = () => {
    if (!this.isStepOptional(this.activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setActiveStep(this.activeStep + 1);
    this.setSkipped(this.activeStep);
  };

  @action.bound
  onFilesAdded = (step: StepsEnum, files: File[]) => {
    const readers: FileReader[] = [];
    files.forEach((file: File, index: number) => {
      readers.push(new FileReader());

      readers[index].addEventListener(
        'load',
        action(async () => {
          // convert image file to base64 string
          // preview.src = reader.result;

          switch (step) {
            case StepsEnum.image:
              this.isLoading = true;
              this.image = await compressToDataUrl(
                readers[index].result as string,
              );
              this.isLoading = false;
              this.imageFile = file;
              break;
            case StepsEnum.queryImage:
              this.queryImage = readers[index].result as string;
              this.queryImageFile = file;
              break;

            default:
              break;
          }
        }),
        false,
      );

      if (file) {
        try {
          readers[index].readAsDataURL(file);
        } catch (err) {
          console.warn(err);
        }
      }
    });
  };

  reloadImage = (step: StepsEnum) => {
    switch (step) {
      case StepsEnum.image:
        this.image = '';
        this.imageFile = undefined;
        break;
      case StepsEnum.queryImage:
        this.queryImage = '';
        this.queryImageFile = undefined;
        break;

      default:
        break;
    }
  };

  getStepContent = (step: StepsEnum) => {
    const { t } = this.props;
    switch (step) {
      case StepsEnum.image:
        return (
          <div className="logo-container">
            {this.image ? (
              <React.Fragment>
                <img className="logo" alt="" src={this.image} />
                <Button onClick={this.reloadImage.bind(this, StepsEnum.image)}>
                  {t('reloadImage')}
                </Button>
              </React.Fragment>
            ) : (
              <DropZoneComponent
                onFilesAdded={this.onFilesAdded.bind(this, StepsEnum.image)}
              />
            )}
          </div>
        );
      case StepsEnum.queryImage:
        return (
          <div className="cover-logo-container">
            {this.queryImage ? (
              <React.Fragment>
                <img className="logo" alt="" src={this.queryImage} />
                <Button
                  onClick={this.reloadImage.bind(this, StepsEnum.queryImage)}
                >
                  {t('reloadImage')}
                </Button>
              </React.Fragment>
            ) : (
              <DropZoneComponent
                onFilesAdded={this.onFilesAdded.bind(
                  this,
                  StepsEnum.queryImage,
                )}
              />
            )}
          </div>
        );
      default:
        break;
    }
  };

  render() {
    const { t, mainStore } = this.props;
    const {
      uploadingPercentCompleted,
      isLoadingImages,
      isProcessing,
    } = mainStore!;

    return (
      <Dialog
        onClose={this.onCancel}
        aria-labelledby="customized-dialog-title"
        open={isLoadingImages}
        className="add-images"
      >
        <DialogContent className="dialog-content">
          {!!uploadingPercentCompleted || isProcessing ? (
            <React.Fragment>
              {!!uploadingPercentCompleted && (
                <LinearProgress value={uploadingPercentCompleted} />
              )}
              {isProcessing && <CircularProgress />}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography>{t('title')}</Typography>
              <Stepper activeStep={this.activeStep}>
                {this.steps.map((label, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: { optional?: React.ReactNode } = {};

                  if (this.isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <div className="step-content">
                {this.getStepContent(this.activeStep)}
              </div>

              <div className="buttons">
                <Button
                  disabled={this.activeStep === 0}
                  onClick={this.handleBack}
                >
                  {t('back')}
                </Button>
                {this.isStepOptional(this.activeStep) &&
                  this.activeStep === this.steps.length - 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleSkip}
                    >
                      {t('later')}
                    </Button>
                  )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  disabled={this.isNextDisabled(this.activeStep)}
                >
                  {this.activeStep === this.steps.length - 1
                    ? t('finish')
                    : t('next')}
                </Button>
              </div>
            </React.Fragment>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

export default withTranslation('loadImages')(LoadImagesModalComponent);
