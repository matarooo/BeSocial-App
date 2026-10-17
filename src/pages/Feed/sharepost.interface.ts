export interface SharedPostResponseType {
  success: boolean
  message: string
  data: SharedPost
}

export interface SharePostRequestData {
  body: string
}

export interface SharedPost {
  post: Post
}

export interface Post {
  _id: string
  body: string
  privacy: string
  user: User
  sharedPost: SharedPost
  likes: any[]
  createdAt: string
  commentsCount: number
  topComment: any
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface SharedPost {
  _id: string
  body: string
  image: string
  privacy: string
  user: User2
  sharedPost: any
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment: any
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
}

export interface User2 {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
