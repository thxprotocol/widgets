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
                            <div class="ft" :style="`background-image: url(${creator.collectible.asset})`"></div>
                            <div class="rt" :style="`background-image: url(${creator.collectible.avatar})`"></div>
                            <div class="bk"></div>
                            <div class="lt"></div>
                            <div class="tp"></div>
                            <div class="bm"></div>
                        </div>
                    </div>
                    <p class="text-muted">
                        Created by <a href="">{{ creator.name }}</a>
                    </p>
                    <p>
                        {{ creator.collectible.description }}
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
                    <h1>#32 - {{ creator.collectible.title }}</h1>
                    <p class="text-muted">
                        Currently owned by <a href="">{{ creator.pool }}</a>
                    </p>

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
                                    1 days ago
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
                                    3 days ago
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
                                    6 days ago
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
                                    9 days ago
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

    creators = [
        {
            name: 'Van Apple Art',
            pool: 'The Van Apple Art Collection',
            picture: require('../assets/fabio-picture.jpg'),
            collectible: {
                title: 'The New World Order',
                avatar: require('../assets/appleart-avatar.png'),
                asset: require('../assets/appleart.png'),
                description:
                    'Van Apple visualizes the bigger picture, there is no line between fantasy and reality. He tries to make you part of the play.',
            },
        },
        {
            name: 'Ruben Lenten',
            pool: 'The LEN10 Collection',
            picture: require('../assets/fabio-picture.jpg'),
            collectible: {
                title: 'LEN10 is Back',
                avatar: require('../assets/len10-avatar.png'),
                asset: require('../assets/len10.png'),
                description:
                    "After 3 surgeries, a lot of patience and hard work I've made it back to my kiteboard. So stoked to feel the freedom of kiting again after two years.",
            },
        },
        {
            name: 'Apple Art',
            pool: 'The Fabio Wibmer Collection',
            picture: require('../assets/fabio-picture.jpg'),
            collectible: {
                title: 'My First Backflip',
                avatar: require('../assets/fabio-avatar.png'),
                asset: require('../assets/fabio.png'),
                description:
                    'This unique piece of video content has been shot during the championships in 2009. It shows a young Fabio doing his first backflip on the bike.',
            },
        },
        {
            name: 'Matthias Dandois',
            pool: 'The Dandois Collection',
            picture: require('../assets/dois-picture.jpg'),
            collectible: {
                title: 'Unlocked Down - A Midnight Cruise in Paris',
                avatar: require('../assets/dois-avatar.png'),
                asset: require('../assets/dois.jpg'),
                description:
                    'Paris is the most visited city in the world and is always full of energy and surprises. The streets that were once full of cars, tourist and pedestrians suddenly became quiet and empty ',
            },
        },
        {
            name: 'World Surf League',
            pool: 'The WSL Collection',
            picture: require('../assets/wsl-picture.jpg'),
            collectible: {
                title: 'Paige Alms At Todos Santos',
                avatar: require('../assets/wsl-avatar.jpg'),
                asset: require('../assets/wsl.png'),
                description:
                    "2021 Women's Biggest Paddle Nominee: Paige Alms At Todos Santos on January 11, 2021. Video From Ryan Craig.",
            },
        },
        {
            name: 'Colin Furze',
            pool: 'The Colin Furze Collection',
            picture: require('../assets/furze-picture.png'),
            collectible: {
                title: 'The big dump',
                avatar: require('../assets/furze-avatar.png'),
                asset: require('../assets/furze.png'),
                description:
                    'The world’s fastest fully-working toilet, it even flushes at a whopping 55mph. This petrol-powered lavatory uses a powerful 140cc motorbike engine and flushes using a button on the handle bars.',
            },
        },
    ];

    get creator() {
        return this.creators[5];
    }

    mounted() {
        // debugger;
    }

    buy() {
        debugger;
    }
}
</script>
