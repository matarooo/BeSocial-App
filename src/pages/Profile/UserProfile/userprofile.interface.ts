export interface UserProfileResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  isFollowing: boolean
  user: UsersData
}

export interface UsersData {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth: string
  gender: string
  photo: string
  cover: string
  followers: Follower[]
  following: Following[]
  createdAt: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface Follower {
  _id: string
  name: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface Following {
  _id: string
  name: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
