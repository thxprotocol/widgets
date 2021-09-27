<template>
    <div class="alert alert-danger" v-if="error">
        {{ error }}
    </div>
    <div class="card" v-else>
        <div class="card-body flex-row justify-content-between d-flex p-1">
            <a class="btn btn-link" target="_blank" :href="`${walletUrl}/pool/${poolAddress}`">
                <span class="mr-1">&#127873; </span>
                <span class="text-dark" v-if="!user">Claim your </span>
                <span class="text-dark" v-if="user">Your </span>
                <strong class="text-purple">{{ rewardAmount }} {{ rewardSymbol }}</strong>
            </a>
            <button class="btn btn-primary rounded-pill" v-if="user" @click="claim()" :disabled="isClaimed || loading">
                <div v-if="loading" class="spinner"></div>
                <template v-else>
                    <span>Claim</span>
                    <icon-chevron-right />
                </template>
            </button>
            <button class="btn btn-primary rounded-pill" v-if="!user" @click="signinRedirect()" :disabled="loading">
                <div v-if="loading" class="spinner"></div>
                <template v-else>
                    <span>Claim</span>
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
import IconChevronRight from '@/components/IconChevronRight.vue';
import { API_ROOT, WALLET_URL } from '@/utils/secrets';
import { getOIDCConfig } from '@/utils/oidc';

@Component({
    components: {
        'icon-chevron-right': IconChevronRight,
    },
})
export default class ViewClaim extends Vue {
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

            if (r.status !== 200) {
                return { error: Error('POST /reward/:id/claim failed.') };
            }

            await this.checkReward();
        } catch (e) {
            return { error: new Error('Unable to claim reward.') };
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
