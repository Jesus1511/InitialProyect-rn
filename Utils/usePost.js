import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'

export const url = "http://192.168.0.107:3000"

export const usePost = async (route, params) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const actualParams = {...params, token}
        const response = await axios.post(url + route, actualParams);
        if (response.data) {
            return response.data; 
        }
    } catch (err) {
        console.error(err)
        return null
    }

};