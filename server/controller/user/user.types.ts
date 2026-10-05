import type { InferSchemaType } from "mongoose";

import type { AuthenticatedRequest } from "#controller";

import type { User } from "#models";

export interface UpdateUserProfileBody {
  name?: string;
  phone?: string;
  address?: string;
  removeAvatar?: string | boolean;
}

export interface UpdateUserProfileRequest extends AuthenticatedRequest {
  body: UpdateUserProfileBody;
}

type UserFields = InferSchemaType<typeof User.schema>;

export type PublicUserProfile = Pick<
  UserFields,
  "name" | "avatar" | "role" | "createdAt"
>;

export type UserProfile = Pick<
  UserFields,
  "name" | "email" | "phone" | "address" | "avatar" | "role" | "createdAt" | "updatedAt"
>;

export type ProfileResponseBody =
  | { success: true; message?: string; user: UserProfile }
  | { success: false; message: string };

export type PublicProfileResponseBody =
  { success: true; user: PublicUserProfile } | { success: false; message: string };
