import { axiosInterceptor } from "../../../axios-interceptors/axiosinterceptors"
import type { FollowSuggestResponseType } from "./follow-suggest.interface"
import type { PutFollowResponseType } from "./put-follow-suggest.interface"
import type { SearchFieldResponseType } from "./search.interface"

const getFollowSuggestPage = async (limit: number, page: number) => {
        const response = await axiosInterceptor.get<FollowSuggestResponseType>(
                `/users/suggestions?limit=${limit}&page=${page}`,
        )
        return response.data
}

export const getFollowSuggest = async (limit: number): Promise<FollowSuggestResponseType["data"]["suggestions"]> => {
        const response = await getFollowSuggestPage(limit, 1)

        return response.data.suggestions
}

export const searchFollowSuggestions = async (
        query: string,
        page = 1,
        limit = 20,
): Promise<SearchFieldResponseType["data"]["users"]> => {
        const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                q: query,
        })
        const response = await axiosInterceptor.get<SearchFieldResponseType>(
                `/users/search?${params.toString()}`,
        )
        return response.data.data.users
}

export const putFollowSuggest = async (userId:string): Promise<PutFollowResponseType> => {
        const response = await axiosInterceptor.put<PutFollowResponseType>(`/users/${userId}/follow`)

        return response.data
}
