<template>
    <div class="music-item">
        <v-card class="music-card" outlined>
            <v-card-text class="music-card-text">
                <img class="album-art" :src="data.albumCoverUrl"/>
                <div class="inline-block v-align-top">
                    <p class="info-item music-title">{{data.songName}}</p>
                    <p class="info-item artist-name">{{data.artistName}}</p>
                    <p></p>
                </div>
                <div class="inline-block v-align-middle" style="float: right">
                    <v-btn small @click="onClick()">{{text}}</v-btn>
                </div>
            </v-card-text>
<!--            <v-card-actions>-->
<!--                <v-btn small @click="onClick()">{{text}}</v-btn>-->
<!--            </v-card-actions>-->
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "TableItem",
        props: {
            data: {
                type: Object,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        },
        methods: {
            makeData() {
                return this.data;
            },
            onClick() {
                this.$emit('click', this.makeData())
            }
        }
    }
</script>

<style scoped>
    .inline {
        display: inline-block;
    }

    .inline-block {
        display: inline-block;

    }
    .v-align-top {
        vertical-align: top;
    }
    .v-align-middle {
        vertical-align: center;
    }
    .flex {
        display: flex;
    }

    .info-item {
        margin-top: 0;
        margin-bottom: 0;
        padding: 0;
    }

    .album-art {
        width: 64px;
        height: 64px;
        margin-right: 1rem;
        border-radius: 10%;
        border: 1px solid #2c3e50;
    }
    .music-item {
        margin-bottom: 10px;
        margin-top: 10px;
        padding: 0;
    }
    .music-card-text {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        padding-left: 0.5rem;
    }
</style>