export interface ItemImageVariant {
  sm: string | null;
  md: string | null;
  lg: string | null;
  original: string | null;
}

export interface ItemRolePermission {
  id: number;
  role: string;
  role_detail: ItemUserRole;
  permissions: string[];
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface ItemUserRole {
  text: string;
  value: string;
}

export interface ItemUserPermission {
  text: string;
  value: string;
  children: ItemUserPermission[];
}

export interface ItemUserRolePermission {
  role: string;
  permission: string[];
}

export interface ItemActiveStatus {
  text: string;
  value: string;
  color: string;
}

export interface ItemUser {
  id: number;
  uuid: string;
  name: string;
  username: string;
  email: string;
  picture: string | null;
  picture_url: string | null;
  picture_url_variant: ItemImageVariant;
  role: string;
  role_detail: ItemUserRole;
  permissions: string[];
  is_role_permission_custom: boolean;
  is_email_verified: boolean;
  is_active: boolean;
  is_active_detail: ItemActiveStatus;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface ItemSetting {
  id: number;
  key: string;
  value: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface ItemConst {
  items_user_role: ItemUserRole[];
  items_user_permission: ItemUserPermission[];
  items_user_role_permission: ItemUserRolePermission[];
  items_active_status: ItemActiveStatus[];
}
