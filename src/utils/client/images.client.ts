import axios from 'axios'
import { RetrieveResponse } from '../../models/api/Retrieve-response.model'

class ImagesClientService {

    async uploadImages(image: File, queryImage: File, onUploadProgress: (progressEvent: any) => void): Promise<RetrieveResponse> {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('queryImage', queryImage)

        const { data } = await axios.post<RetrieveResponse>(`/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress
            }
        )

        return data
    }
}

export default new ImagesClientService()