
import { observable, action, makeObservable } from 'mobx'

import i18n from 'i18next'
import imagesClient from '../utils/client/images.client'
import { QueryResult } from '../models/Query-result.model'
import { getImageDimensions, compressToFile } from '../utils/image.utils'

export enum UploadImagesErrorEnum {
    Server,
    NoMatch
}


class MainStore {
    isRtl: boolean

    @observable isLoadingImages = false
    @observable isResultDisplayed = false
    @observable isProcessing = false
    @observable uploadingPercentCompleted = 0
    @observable error?: UploadImagesErrorEnum

    @observable image?: string
    @observable result?: QueryResult

    constructor() {
        makeObservable(this)
        const lang = i18n.language || window.localStorage.i18nextLng || ''
        this.isRtl = lang === 'he-IL' || lang === 'ar'
    }

    @action
    setIsLoadingImages = (state: boolean) => {
        this.isLoadingImages = state
    }

    @action
    setIsResultDisplayed(state: boolean) {
        this.isResultDisplayed = state
    }

    @action
    onUploading = (progressEvent: any) => {
        this.uploadingPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        if (this.uploadingPercentCompleted === 100) {
            this.uploadingPercentCompleted = 0
            this.isProcessing = true
        }
    }

    @action.bound
    uploadImages = async (image: File, queryImage: File, imageAsUrl: string, queryImageAsUrl: string) => {
        try {
            if (image.size > 100000) {
                image = await compressToFile(image.name, imageAsUrl)
                queryImage = await compressToFile(queryImage.name, queryImageAsUrl)
            }
            this.uploadingPercentCompleted = 1
            const res = await imagesClient.uploadImages(image, queryImage, this.onUploading)
            const { width, height } = getImageDimensions(queryImageAsUrl)
            this.result = {
                score: res.score,
                location: {
                    x: res.location[0],
                    y: res.location[1],
                    width,
                    height
                }
            }
            this.image = imageAsUrl
            this.isResultDisplayed = true
        } catch (err) {
            this.uploadingPercentCompleted = 0
            console.warn(err)
            if (err.isAxiosError) {
                this.error = UploadImagesErrorEnum.Server
            } else {
                this.error = UploadImagesErrorEnum.NoMatch
            }
        } finally {
            this.isLoadingImages = false
            this.isProcessing = false
        }
    }
}

export default MainStore