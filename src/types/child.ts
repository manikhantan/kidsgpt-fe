export interface Child {
  id: string;
  name: string;
  username: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChildData {
  name: string;
  username: string;
  password: string;
}

export interface UpdateChildData {
  name?: string;
  password?: string;
}

export interface ChildStats {
  totalMessages: number;
  blockedAttempts: number;
  lastActive?: string;
}

export interface ChildWithStats extends Child {
  stats?: ChildStats;
}
