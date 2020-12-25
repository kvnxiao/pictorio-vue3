import { BASE_URL } from "@/api/endpoints"
import axios from "axios"

export const service = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
})
