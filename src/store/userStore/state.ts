import { User } from "@/models/user"

export enum Status {
  JOINED = 0,
  LEFT = 1,
}

export interface UserStatus {
  user: User
  status: Status
}

export interface UserState {
  selfUser: User
  userIds: {
    [userId: string]: UserStatus
  }
}

export const state: UserState = {
  selfUser: { id: "", name: "" },
  userIds: {},
}
