export interface GetNotificationsResponseType {
  success: boolean
  message: string
  data: NotificationsData
  meta: Meta
}

export interface NotificationsData {
  notifications: NotificationItem[]
}

export interface NotificationItem {
  _id: string
  type?: string
  message?: string
  isRead?: boolean
  createdAt?: string
  sender?: NotificationActor
  actor?: NotificationActor
  user?: NotificationActor
  post?: {
    body?: string
  }
  entity?: {
    body?: string
  }
}

export interface NotificationActor {
  name?: string
  photo?: string
}

export interface Meta {
  feedMode: string
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
}

export interface UnreadCountResponseType {
  success: boolean
  message: string
  data: UnreadCountData
}

export interface UnreadCountData {
  unreadCount: number
}
