export interface BaseDomain {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateDomain<T extends BaseDomain> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateDomain<T extends BaseDomain> = Partial<
  Omit<T, "createdAt" | "updatedAt">
> &
  Pick<T, "id">;
