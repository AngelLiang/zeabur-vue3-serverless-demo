import axios from 'axios';
import Http from "@/utils/http"

export const getIndex = params => {
    return Http.get("/api/index", params)
}
