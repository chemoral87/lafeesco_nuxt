<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" sm="6" md="2">
                <v-text-field append-icon="mdi-magnify" clearable hide-details v-model="filterSkyRoom"
                    placeholder="Filtro"></v-text-field>
            </v-col>

            <v-spacer />
            <v-col cols="auto">
                <v-btn color="success" @click="$router.push('sky_room/new')" class="mb-1 mr-1">
                    <v-icon>mdi-account-plus</v-icon>Nuevo SkyRoom </v-btn>
            </v-col>
            <v-col cols="12">
                <SkyRoomTable @sorting="indexSkyRoom" :options="options" :response="response" @edit="editSkyRoom"
                    @delete="deleteSkyRoom" :dialogDelete.sync="dialogDeleteSkyRoom" />
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
export default {
    async asyncData({ $axios, app }) {
        let options = {
            sortBy: ["name"],
            sortDesc: [true],
            itemsPerPage: 5,
        };
        const response = await app.$repository.SkyRoom.index(options).catch((e) => { });
        return { response, options };
    },
    watch: {
        async filterSkyRoom(value) {
            let me = this;
            this.$store.dispatch("hideNextLoading");
            let op = Object.assign(me.options, { filter: value, page: 1 });
            me.response = await me.$repository.SkyRoom.index(op);
        },
    },
    methods: {
        async indexSkyRoom(options) {
            if (options) {
                this.options = Object.assign(this.options, options);
            }
            let op = Object.assign({ filter: this.filter }, this.options);
            this.response = await this.$repository.SkyRoom.index(op);
        },
        editSkyRoom(item) {
            this.$router.push(`/sky_room/${item.id}`);
        },
        async deleteSkyRoom(item) {
            await this.$repository.Sky_room.delete(item.id)
                .then((res) => {
                    this.dialogDeleteSky_room = false;
                    this.indexSkyRoom();
                })
                .catch((e) => { });
        },
    },
    data() {
        return {
            dialogDeleteSkyRoom: false,
            options: {},
            response: {},
            filterSkyRoom: "",
        };
    },
    middleware: ["authenticated"],
    validate({ store, error }) {
        return true;
        if (store.getters.permissions.includes("sky_room-index")) return true;
        else throw error({ statusCode: 403 });
    },
    created() {
        this.$nuxt.$emit("setNavBar", {
            title: "SkyRoom",
            icon: "human-greeting-variant",
        });
    },
};
</script>
