export interface CommentLikeResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  liked: boolean
  likesCount: number
  comment: Comment
}

export interface Comment {
  _id: string
  content: string
  image: string
  commentCreator: CommentCreator
  post: string
  parentComment: any
  likes: string[]
  createdAt: string
  likesCount: number
  isReply: boolean
  id: string
}

export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
