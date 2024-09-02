export interface BaseDBData {
  id: number;
  created_at: string;
  updated_at: string;
}
export type CreateDBData<T extends BaseDBData> = Omit<
  T,
  "id" | "created_at" | "updated_at"
>;
export type UpdateDBData<T extends BaseDBData> = Partial<
  Omit<T, "created_at">
> &
  Pick<T, "id">;
