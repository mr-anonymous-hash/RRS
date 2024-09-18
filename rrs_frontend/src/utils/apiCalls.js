import axios from 'axios';

const apiCall = async(endPoint, methods, data, formData) => {
    const endPointPrefix = 'http://localhost:8000/api'
    const headers = {
        'Content-Type': 'application/json'
    }
    if(formData===true){
        headers['Content-Type'] = 'multipart/form-data'
    }
    const accessToken = localStorage.getItem('access_token')

    headers['Authorization'] = `Bearer ${accessToken}`
    console.log(headers)

    return await axios({
        method: methods,
        url: endPointPrefix+endPoint,
        data: data,
        headers: headers
    })
}

export default apiCall;