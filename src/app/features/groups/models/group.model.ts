export type GroupVisibility = 0 | 1;

export const GroupVisibilityLabel: Record<GroupVisibility, string> = {
  0: 'Public',
  1: 'Privé',
};

export type GroupMemberRole = 0 | 1 | 2;

export const GroupMemberRoleLabel: Record<GroupMemberRole, string> = {
  0: 'Membre',
  1: 'Modérateur',
  2: 'Propriétaire',
};

export type GroupJoinRequestStatus = 0 | 1 | 2;

export interface GroupSummaryDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly visibility: GroupVisibility;
  readonly ownerName: string;
  readonly memberCount: number;
  readonly created: string;
  readonly isMember: boolean;
}

export interface GroupDetailDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly visibility: GroupVisibility;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly memberCount: number;
  readonly created: string;
  readonly isMember: boolean;
  readonly currentUserRole: GroupMemberRole | null;
  readonly hasPendingRequest: boolean;
}

export interface GroupMemberDto {
  readonly userId: string;
  readonly name: string;
  readonly role: GroupMemberRole;
  readonly joinedAt: string;
}

export interface JoinRequestDto {
  readonly requestId: string;
  readonly userId: string;
  readonly userName: string;
  readonly status: GroupJoinRequestStatus;
  readonly createdAt: string;
}

export interface GroupsListResponse {
  readonly items: ReadonlyArray<GroupSummaryDto>;
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface CreateGroupPayload {
  readonly name: string;
  readonly description: string;
  readonly visibility: GroupVisibility;
}

export interface UpdateGroupPayload {
  readonly name: string;
  readonly description: string;
  readonly visibility: GroupVisibility;
}
