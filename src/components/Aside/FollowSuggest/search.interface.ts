export interface SearchFieldResponseType {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  users: User[]
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
  isFollowing?: boolean
  followersCount?: number
  mutualFollowersCount?: number
}

export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
}
