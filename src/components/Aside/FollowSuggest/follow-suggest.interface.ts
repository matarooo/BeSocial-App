export interface FollowSuggestResponseType {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  suggestions: SuggestionList[]
}

export interface SuggestionList {
  _id: string
  name: string
  username: string
  photo: string
  mutualFollowersCount?: number
  followersCount?: number
  isFollowing?: boolean
}

export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
  nextPage: number
}
