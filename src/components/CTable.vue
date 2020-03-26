<template>
    <div>
        <div>
            <table style="width: 100%">
                <thead>
                    <th :key="index" v-for="(header, index) in headers">
                        <div :style="{'font-size': headerFontSize}">
                            {{header.text}}
                        </div>
                    </th>
                </thead>
                <tbody>
                    <tr class="table-item" @click="rowClick(row)" :key="index" v-for="(row, index) in items">
                        <td  :key="header_index" v-for="(header,header_index) in headers">
                            <template v-if="header.type === 'image'">
                                <img
                                        :style="{
                                            width : !!header.width ? header.width + 'px' : '40px',
                                            height : !!header.height ? header.height + 'px': '40px',
                                        }"
                                        :src="row[header.value]"
                                />
                            </template>
                            <template v-else>
                                <div :style="{'font-size': fontSize, 'text-align': !!header.align ? header.align: 'left'}">
                                    {{row[header.value]}}
                                </div>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CTable",
        props: {
            items: {
                type: Array,
                required: true
            },
            headers: {
                type: Array,
                required: true
            },
            fontSize: {
                type: String,
                default: '13px'
            },
            headerFontSize: {
                type: String,
                default: '17px'
            }
        },
        methods: {
            rowClick(row) {
                this.$emit('click', row);
            }
        }
    }
</script>

<style scoped>
    .table-item:hover {
        background-color: antiquewhite;
        cursor: pointer;
    }
    table {
        border-spacing: 0px 0px;
        border-collapse:collapse;
    }
    th, td {
        border: 1px solid gray;
        border-collapse:collapse;
    }
    td {

    }
</style>