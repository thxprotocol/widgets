<template>
    <div class="alert alert-danger" v-if="error">
        {{ error }}
    </div>
    <div class="card" v-else style="max-width: 900px">
        <div class="card-body text-white bg-darker">
            <div class="row">
                <div class="col-md-4">
                    <div class="shape-wrapper mb-3">
                        <div id="shape">
                            <div class="ft" :style="`background-image: url(${require('../assets/fabio.png')})`"></div>
                            <div
                                class="rt"
                                :style="`background-image: url(${require('../assets/fabio-avatar.png')})`"
                            ></div>
                            <div class="bk"></div>
                            <div class="lt"></div>
                            <div class="tp"></div>
                            <div class="bm"></div>
                        </div>
                    </div>
                    <p class="text-muted">Created by <a href="">Fabio Wibmer</a></p>
                    <p>
                        This unique piece of video content has been shot during the championships in 2009. It shows a
                        young Fabio doing his first backflip on the bike.
                    </p>
                    <hr class="border-dark" />
                    <button
                        class="btn btn-primary rounded-pill btn-block"
                        v-if="user"
                        @click="buy()"
                        :disabled="loading"
                    >
                        <div v-if="loading" class="spinner"></div>
                        <template v-else>
                            <span>Buy</span>
                            <icon-chevron-right />
                        </template>
                    </button>
                    <button
                        class="btn btn-primary rounded-pill btn-block m-0"
                        v-if="!user"
                        @click="signinRedirect()"
                        :disabled="loading"
                    >
                        <div v-if="loading" class="spinner"></div>
                        <template v-else>
                            <span>Buy this Collectible</span>
                            <icon-chevron-right />
                        </template>
                    </button>
                    <a class="btn btn-link btn-block text-light" href="https://www.google.nl"> About the creator </a>
                </div>
                <div class="col-md-8">
                    <h1>#32 - My First Backflip</h1>
                    <p class="text-muted">Currently owned by <a href="">The Fabio Wibmer Collection</a></p>

                    <div class="mt-4 mb-2">
                        <strong>
                            <i class="fas fa-tag"></i>
                            Listings
                        </strong>
                    </div>
                    <div class="list-group">
                        <div
                            class="
                                list-group-item
                                d-flex
                                justify-content-between
                                align-items-center
                                text-white
                                bg-darker
                                border-dark
                            "
                        >
                            <span>Open Sea</span>
                            <div>
                                <span class="badge badge-primary mr-2">0.22 ETH</span>
                                <span class="small text-muted">($585.62)</span>
                                <button class="btn btn-link btn-sm">
                                    <i class="fas fa-external-link-alt text-gray"></i>
                                </button>
                            </div>
                        </div>
                        <div
                            class="
                                list-group-item
                                d-flex
                                justify-content-between
                                align-items-center
                                text-white
                                bg-darker
                                border-dark
                            "
                        >
                            <span>Rarible</span>
                            <div>
                                <span class="badge badge-primary mr-2">0.21 ETH</span>
                                <span class="small text-muted">($585.62)</span>
                                <button class="btn btn-link btn-sm">
                                    <i class="fas fa-external-link-alt text-gray"></i>
                                </button>
                            </div>
                        </div>
                        <div
                            class="
                                list-group-item
                                d-flex
                                justify-content-between
                                align-items-center
                                text-white
                                bg-darker
                                border-dark
                            "
                        >
                            <span> Binance </span>

                            <div>
                                <span class="badge badge-primary mr-2">0.23 ETH</span>
                                <span class="small text-muted">($585.62)</span>
                                <button class="btn btn-link btn-sm">
                                    <i class="fas fa-external-link-alt text-gray"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 mb-2">
                        <strong>
                            <i class="fas fa-chart-line"></i>
                            Trade History
                        </strong>
                    </div>
                    <div class="list-group">
                        <table cellpadding="5" class="table table-bordered text-white bg-darker">
                            <tr class="t-1">
                                <th class="border-darker text-muted">Event</th>
                                <th class="border-darker text-right text-muted">Price</th>
                                <th class="border-darker text-right text-muted">From</th>
                                <th class="border-darker text-right text-muted">To</th>
                                <th class="border-darker text-right text-muted">Date</th>
                            </tr>
                            <tr>
                                <td class="border-dark"><strong>Trade</strong></td>
                                <td class="border-dark text-right">0.22 ETH</td>
                                <td class="border-dark text-right">0x9B3A6</td>
                                <td class="border-dark text-right">0x88B1F</td>
                                <td class="border-dark text-right">
                                    4 days ago
                                    <button class="btn btn-link btn-sm">
                                        <i class="fas fa-external-link-alt text-gray"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td class="border-dark"><strong>List</strong></td>
                                <td class="border-dark text-right">0.20 ETH</td>
                                <td class="border-dark text-right">0x6F886</td>
                                <td class="border-dark text-right">0x9B3A6</td>
                                <td class="border-dark text-right">
                                    4 days ago
                                    <button class="btn btn-link btn-sm">
                                        <i class="fas fa-external-link-alt text-gray"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td class="border-dark"><strong>Sold</strong></td>
                                <td class="border-dark text-right">0.10 ETH</td>
                                <td class="border-dark text-right">0xFA9B3</td>
                                <td class="border-dark text-right">0x6F886</td>
                                <td class="border-dark text-right">
                                    4 days ago
                                    <button class="btn btn-link btn-sm">
                                        <i class="fas fa-external-link-alt text-gray"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td class="border-dark"><strong>Mint</strong></td>
                                <td class="border-dark text-right">0.00 ETH</td>
                                <td class="border-dark text-right">0x00000</td>
                                <td class="border-dark text-right">0xFA9B3</td>
                                <td class="border-dark text-right">
                                    4 days ago
                                    <button class="btn btn-link btn-sm">
                                        <i class="fas fa-external-link-alt text-gray"></i>
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IconChevronRight from '@/components/IconChevronRight.vue';
import { User, UserManager } from 'oidc-client';
import { WALLET_URL } from '@/utils/secrets';

@Component({
    components: {
        'icon-chevron-right': IconChevronRight,
    },
})
export default class ViewCollect extends Vue {
    walletUrl = WALLET_URL;
    userManager!: UserManager;
    user: User | null = null;

    poolAddress = '';

    clientId = '';
    clientSecret = '';

    rewardId = '';
    rewardAmount = '';
    rewardSymbol = '';

    error = '';
    loading = false;

    mounted() {
        // debugger;
    }

    buy() {
        debugger;
    }
}
</script>
