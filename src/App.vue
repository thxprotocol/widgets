<template>
    <div id="app">
        <div class="alert alert-danger" v-if="error">
            {{ error }}
        </div>
        <div class="card" v-else>
            <div>
                <a class="btn btn-link" target="_blank" :href="`${walletUrl}/pool/${poolAddress}`">
                    <span>&#127873; </span>
                    <span>
                        <template v-if="!user">Claim your </template>
                        <template v-if="user">Your </template>
                    </span>
                    <strong class="ml-1 text-purple">{{ rewardAmount }} {{ rewardSymbol }}</strong>
                </a>
            </div>
            <button v-if="user" @click="claim()" :disabled="isClaimed || loading">
                <div v-if="loading" class="spinner"></div>
                <template v-else>
                    <span>Claim</span>
                    <icon-chevron-right />
                </template>
            </button>
            <button v-if="!user" @click="signinRedirect()" :disabled="loading">
                <div v-if="loading" class="spinner"></div>
                <template v-else>
                    <span>Sign in</span>
                    <icon-chevron-right />
                </template>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { User, UserManager } from 'oidc-client';
import IconChevronRight from './components/IconChevronRight.vue';
import { API_ROOT, WALLET_URL } from './utils/secrets';
import { getOIDCConfig } from './utils/oidc';

@Component({
    components: {
        'icon-chevron-right': IconChevronRight,
    },
})
export default class App extends Vue {
    walletUrl = WALLET_URL;
    userManager!: UserManager;
    user: User | null = null;
    error = '';
    poolAddress = '';
    clientId = '';
    clientSecret = '';
    rewardId = '';
    rewardAmount = '';
    rewardSymbol = '';

    isClaimed = true;
    loading = false;

    async mounted() {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        this.clientId = localStorage.getItem('thx:claim:oidc:clientId') || url.searchParams.get('client_id') || '';
        localStorage.setItem('thx:claim:oidc:clientId', this.clientId);
        this.clientSecret =
            localStorage.getItem('thx:claim:oidc:clientSecret') || url.searchParams.get('client_secret') || '';
        localStorage.setItem('thx:claim:oidc:clientSecret', this.clientSecret);

        if (!this.userManager) {
            await this.createUserManager();
        }

        if (code) {
            return await this.signinRedirectCallback();
        }

        this.poolAddress = url.searchParams.get('asset_pool') || '';
        this.rewardId = url.searchParams.get('reward_id') || '';
        this.rewardAmount = url.searchParams.get('reward_amount') || '';
        this.rewardSymbol = url.searchParams.get('reward_symbol') || '';

        if (!this.poolAddress || !this.rewardId || !this.clientId || !this.clientSecret) {
            this.error = 'URL Search Params are invalid.';
        }

        const user = await this.userManager.getUser();
        this.user = user && !user.expired ? user : null;

        if (this.user) {
            await this.checkReward();
        }
    }

    async createUserManager() {
        const config = getOIDCConfig(this.clientId, this.clientSecret);

        this.userManager = new UserManager(config);
    }

    async checkReward() {
        this.loading = true;
        try {
            const r = await axios({
                method: 'GET',
                url: API_ROOT + `/v1/account`,
                headers: {
                    Authorization: `Bearer ${this.user?.access_token}`,
                },
            });
            const address = r.data.address;

            if (!address) {
                throw new Error('No known address for this user. Please access https://wallet.thx.network.');
            }

            const res = await axios({
                method: 'GET',
                url: API_ROOT + `/v1/rewards/${this.rewardId}`,
                headers: {
                    Authorization: `Bearer ${this.user?.access_token}`,
                    AssetPool: this.poolAddress,
                },
            });

            if (res.status !== 200) {
                throw new Error('GET /reward/:id failed.');
            }

            this.isClaimed = res.data.beneficiaries.includes(address);
        } catch (e) {
            this.error = e.toString();
        } finally {
            this.loading = false;
        }
    }

    async claim() {
        this.loading = true;
        try {
            const r = await axios({
                method: 'POST',
                url: API_ROOT + `/v1/rewards/${this.rewardId}/claim`,
                headers: {
                    Authorization: `Bearer ${this.user?.access_token}`,
                    AssetPool: this.poolAddress,
                },
            });

            if (r.data.error.message) {
                throw new Error(r.data.error.message);
            }

            if (r.status !== 200) {
                throw new Error('POST /reward/:id/claim failed.');
            }

            await this.checkReward();
        } catch (error) {
            this.error = (error as any).message;
        } finally {
            this.loading = false;
        }
    }

    async signinRedirect() {
        try {
            await this.userManager.clearStaleState();

            this.user = await this.userManager.signinPopup({
                extraQueryParams: { return_url: WALLET_URL },
            });

            await this.checkReward();
        } catch (e) {
            return { error: e };
        }
    }

    async signinRedirectCallback() {
        try {
            await this.userManager.signinPopupCallback();
        } catch (e) {
            return { error: e };
        }
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Exo+2:200,400,400i,700,700i,800,800i,900,900i');

$purple: #5942c1;
$silver: #f8f9fa;
$font-family: 'Exo 2';

body {
    margin: 0;
    font-family: 'Exo 2';
    overflow: hidden;
}

.alert {
    display: block;
    padding: 0.75rem;
    border-radius: 3px;
}

.alert-danger {
    border: 1px solid red;
    color: darken(red, 30%);
    background-color: lighten(red, 40%);
}

.text-purple {
    color: $purple;
}

button:disabled {
    opacity: 0.75;
    cursor: not-allowed !important;
}

.btn-link {
    text-decoration: none;
    color: black;
}

.card {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    width: auto;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 25px;
    padding: 3px;
    background: $silver;
    margin: auto;

    div {
        flex: 1 auto;
        font-size: 1rem;
        padding: 0 0.75rem;
    }

    button {
        font-family: $font-family;
        flex: 0 auto;
        margin-left: 0.75rem;
        border: 0;
        border-radius: 25px;
        padding: 0.75rem 1.2rem;
        background: $purple;
        color: white;
        transition: 0.2s ease all;
        font-size: 1rem;
        cursor: pointer;

        span {
            display: inline;
        }

        svg {
            margin-left: 0.5rem;
        }

        &:hover {
            background-color: #4b37a6;
            border-color: #46339d;
        }

        &:focus {
            box-shadow: 0 0 0 0.2rem rgb(114 94 202 / 50%);
        }
    }
}

.card div.spinner {
    display: inline-block;
    padding: 0;
    position: relative;
    left: 50%;
    margin-left: -7.5px;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        -webkit-transform: rotate(360deg);
    }
}
@-webkit-keyframes spin {
    to {
        -webkit-transform: rotate(360deg);
    }
}
</style>
