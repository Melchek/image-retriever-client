export const CompressQuality = {
    HIGH: .8,
    LOW: .45
}

const getImageDimensions = (image: string): { width: number, height: number } => {
    const queryImg = new Image()
    queryImg.src = image

    return {
        width: queryImg.width,
        height: queryImg.height
    }
}
const getCanvasCtx = async (imageAsUrl: string): Promise<CanvasRenderingContext2D> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = imageAsUrl

        img.onload = () => {
            const elem = document.createElement('canvas')
            elem.width = img.width;
            elem.height = img.height;
            const ctx = elem.getContext('2d')!;
            // img.width and img.height will contain the original dimensions
            ctx.drawImage(img, 0, 0, img.width, img.height);
            resolve(ctx)
        }
    })
}

const compressToFile = async (imageName: string, imageAsUrl: string, quality: keyof typeof CompressQuality = 'LOW'): Promise<File> => {
    return new Promise(async (resolve, reject) => {
        const ctx = await getCanvasCtx(imageAsUrl)
        ctx.canvas.toBlob((blob) => {
            if (!blob) {
                reject()
            } else {
                const file = new File([blob], imageName, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                })
                console.log('file.size')
                console.log(file.size)
                resolve(file)
            }
        }, 'image/jpeg', CompressQuality[quality]);
    })
}

const compressToDataUrl = async (imageAsUrl: string, quality: keyof typeof CompressQuality = 'LOW'): Promise<string> => {
    const ctx = await getCanvasCtx(imageAsUrl)
    return ctx.canvas.toDataURL('image/jpeg', CompressQuality[quality])
}

export {
    getImageDimensions,
    compressToFile,
    compressToDataUrl
}