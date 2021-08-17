import { API_ROOT, BASE_URL } from './secrets';

export function getOIDCConfig(clientId: string, clientSecret: string) {
    return {
        authority: API_ROOT,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: BASE_URL,
        response_type: 'code',
        id_token_signed_response_alg: 'RS256',
        post_logout_redirect_uri: BASE_URL,
        silent_redirect_uri: `${BASE_URL}/silent-renew.html`,
        automaticSilentRenew: true,
        loadUserInfo: true,
        scope: 'openid user widget',
    };
}
