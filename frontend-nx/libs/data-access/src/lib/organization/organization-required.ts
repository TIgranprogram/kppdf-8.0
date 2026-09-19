import type { OrganizationsListResponse } from './organization.types';

/** Canonical user-facing explanation for create flows that need our Organization. */
export const ORGANIZATION_REQUIRED_MESSAGE =
  'Нет организации: создайте фирму в Админ → Наши организации.';

/**
 * Returns true when the organization list contains no usable firms.
 * `total` is the server source of truth; the item fallback keeps the helper
 * safe for lightweight list fixtures that omit the envelope count.
 */
export function isOrganizationsEmpty(
  response: Pick<OrganizationsListResponse, 'total' | 'items'> | null | undefined,
): boolean {
  return response ? response.total === 0 || response.items.length === 0 : true;
}
