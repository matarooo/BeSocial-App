export interface DeletePostResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  post: UpdatePost
}

export interface UpdatePost {
  _id: string
  body: string
  image: string
  privacy: string
  user: string
  sharedPost: any
  likes: string[]
  createdAt: string
  likesCount: number
  isShare: boolean
  id: string
}
