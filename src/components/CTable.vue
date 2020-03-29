<template>
    <div>
        <div>
            <table style="width: 100%">
                <thead>
                    <th v-if="showSelect" width="10px">
                        <input v-if="showSelectAll" @click="onSelectAll" type="checkbox"/>
                    </th>
                    <th :key="index" v-for="(header, index) in headers" :style="{'font-size':
                        headerFontSize,
                        width: !!header.width ? header.width + 'px'  : ''}"
                    >
                        <div >
                            {{header.text}}
                        </div>
                    </th>
                </thead>
                <tbody>
                    <tr class="table-item" @click="rowClick(row)" :key="index" v-for="(row, index) in items">
                        <td v-if="showSelect">
                            <input v-model="selected[index]" type="checkbox"/>
                        </td>
                        <td  :key="header_index" v-for="(header,header_index) in headers">
                                <img  v-if="header.type === 'image'"
                                        :style="{
                                            width : !!header.width ? header.width + 'px' : '40px',
                                            height : !!header.height ? header.height + 'px': '40px',
                                        }"
                                        :src="row[header.value]"
                                />
                                <button v-else-if="header.type === 'button'" @click="header.click(row)">
                                    {{header.text}}
                                </button>
                                <div v-else :style="{'font-size': fontSize, 'text-align': !!header.align ? header.align: 'left'}">
                                    {{row[header.value]}}
                                </div>
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
        created() {
          if(this.showSelect) {
              this.selected = Array(this.items.length).fill(false);
          }
        },
        data () {
            return {
                selected : []
            }
        },
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
            },
            showSelect: {
                type: Boolean,
                default: false
            },
            showSelectAll: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            rowClick(row) {
                this.$emit('click', row);
            },
            onSelectAll(e) {
                const selected = e.target.checked;
                this.selected = Array(this.items.length).fill(selected);
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