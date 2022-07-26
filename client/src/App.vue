<template>
    <div>
        <div id="slogan" class="text-center">
            <h1>NameGator <span class="fa fa-check"></span></h1>
            <br />
            <h6 class="text-secondary">Gerador de nomes utilizando Vue.JS, GraphQL, Node</h6>
        </div>
        <div id="main">
            <AppDomainList></AppDomainList>
        </div>
    </div>
</template>

<script>

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import AppDomainList from "./components/AppDomainList.vue";

export default {
	name: "App",
	components: {
		AppDomainList,
	}
};
</script>

<style>
#slogan {
    margin-top: 30px;
    margin-bottom: 30px;
}

#main {
    background-color: darkgrey;
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
