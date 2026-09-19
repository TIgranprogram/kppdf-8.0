import { isOrganizationsEmpty } from './organization-required';

describe('isOrganizationsEmpty', () => {
  it('uses an empty total as the empty-state signal', () => {
    expect(isOrganizationsEmpty({ total: 0, items: [] })).toBe(true);
  });

  it('accepts a non-empty organization response', () => {
    expect(isOrganizationsEmpty({ total: 1, items: [{ _id: 'org-1' } as never] })).toBe(false);
  });

  it('treats incomplete or missing fixtures as empty', () => {
    expect(isOrganizationsEmpty({ total: 1, items: [] })).toBe(true);
    expect(isOrganizationsEmpty(undefined)).toBe(true);
  });
});
