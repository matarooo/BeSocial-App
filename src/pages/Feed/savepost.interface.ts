export interface SavePostResponseType {
  success: boolean
  message: string
  data: SavePost
}

export interface SavePost {
  bookmarked: boolean
  bookmarksCount: number
}
