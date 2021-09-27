<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {}
</script>

<style lang="scss">
button {
    span {
        display: inline;
    }

    svg {
        margin-left: 0.5rem;
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
