import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        type_list:""
    },
    mutations:{
        saveType(state,type_list){
            state.type_list = type_list
        },
    }
})