/* eslint-disable @typescript-eslint/no-explicit-any */
import { logout } from './index';

describe('Logout Controller', () => {
  let req: any = {};
  let res: any = {};

  beforeEach(() => {
    req = {};
    res = {};
  });

  test('signs out when cookie is present', async () => {
    req = {
      cookies: {
        jid: 'some-cookie'
      }
    };

    res.clearCookie = jest.fn();

    expect(await logout(req, res)).toMatchSnapshot();
    expect(res.clearCookie).toHaveBeenCalled();
  });

  test('fails to sign out when cookie is present', async () => {
    req = {
      cookies: {}
    };
    expect(await logout(req, res)).toMatchSnapshot();
  });
});
