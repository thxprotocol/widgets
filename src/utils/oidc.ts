import { API_ROOT, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, BASE_URL } from './secrets';

export const config: any = {
    authority: API_ROOT,
    client_id: OIDC_CLIENT_ID,
    client_secret: OIDC_CLIENT_SECRET,
    redirect_uri: BASE_URL,
    response_type: 'code',
    id_token_signed_response_alg: 'RS256',
    post_logout_redirect_uri: BASE_URL,
    silent_redirect_uri: `${BASE_URL}/silent-renew.html`,
    automaticSilentRenew: true,
    loadUserInfo: true,
    scope: 'openid user widget',
};
