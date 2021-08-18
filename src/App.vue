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
            <button v-if="user" @click="claim()" :disabled="isClaimed">
                <span>Claim</span>
                <icon-chevron-right />
            </button>
            <button v-if="!user" @click="signinRedirect()">
                <span>Login</span>
                <icon-chevron-right />
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
        try {
            const r = await axios({
                method: 'GET',
                url: API_ROOT + `/v1/rewards/${this.rewardId}`,
                headers: {
                    Authorization: `Bearer ${this.user?.access_token}`,
                    AssetPool: this.poolAddress,
                },
            });

            if (r.status !== 200) {
                return { error: Error('GET /reward/:id failed.') };
            }

            this.isClaimed = r.data.beneficiaries.includes(this.user?.profile.address);
        } catch (e) {
            return { error: new Error('Unable to claim reward.') };
        }
    }

    async claim() {
        try {
            const r = await axios({
                method: 'POST',
                url: API_ROOT + `/v1/rewards/${this.rewardId}/claim`,
                headers: {
                    Authorization: `Bearer ${this.user?.access_token}`,
                    AssetPool: this.poolAddress,
                },
            });

            if (r.status !== 200) {
                return { error: Error('POST /reward/:id/claim failed.') };
            }

            await this.checkReward();
        } catch (e) {
            return { error: new Error('Unable to claim reward.') };
        }
    }

    async signinRedirect() {
        try {
            await this.userManager.clearStaleState();

            this.user = await this.userManager.signinPopup();

            await this.checkReward();
        } catch (e) {
            return { error: e };
        }
    }

    async signinRedirectCallback() {
        try {
            debugger;
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
.btn {
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
</style>
