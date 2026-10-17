export interface UpdatePostResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  post: Post
}

export interface Post {
  _id: string
  image: string
  privacy: string
  user: string
  sharedPost: any
  likes: string[]
  createdAt: string
  body: string
  likesCount: number
  isShare: boolean
  id: string
}
