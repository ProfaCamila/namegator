<template>
    <div>
        <div id="main">
            <div class="container">
                <div class="row">
                    <div class="col-md">
                        <AppItemList v-bind:items="prefixes" v-on:addItem="addPrefix" v-on:deleteItem="removePrefix">
                        </AppItemList>
                    </div>
                    <div class="col-md">
                        <AppItemList v-bind:items="sufixes" v-on:addItem="addSufix" v-on:deleteItem="removeSufix">
                        </AppItemList>
                    </div>
                </div>
            </div>
        </div>
        <h5>Domínios <span class="badge badge-info"> {{ domains.lenght }} </span></h5>
        <div class="card">
            <div class="card-body">
                <ul class="list-group">
                    <li class="list-group-item" v-for="domain in domains" v-bind:key="domain.name">
                        <div class="row">
                            <div class="col-md">
                                {{ domain.name }}
                            </div>
                            <div class="col-md text-right">
                                <a class="btn btn-info" v-bind:href="domain.checkout" target="_blank"><span
                                        class="fa fa-shopping-cart"></span></a>
                            </div>
                        </div>

                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

//import { assertExpressionStatement } from "@babel/types";
import "bootstrap/dist/css/bootstrap.css";
//import { response } from "express";
import "font-awesome/css/font-awesome.css";
import axios from "axios/dist/axios";
import AppItemList from "./AppItemList.vue";


export default {
	name: "App",
	components: {
		AppItemList,
	},
	data: function () {
		return {
			prefixes: [],
			sufixes: []
		};
	},
	methods: {
		addPrefix(prefix) {
			axios({
				url: "http://localhost:4000",
				method: "post",
				data: {
					query: `
                        mutation ($item: ItemInput) {
                            newPrefix: saveItem(item: $item) {
                                id
                                type
                                description
                            }
                        }
                    `,
					variables: {
						item: {
							type: "prefix",
							description: prefix
						}
					}
				}
			}).then(response => {
				// this.getPrefixes(); //busca novamente no servidor a lista de prefixos!
				//outra opção
				const query = response.data;
				const newPrefix = query.data.newPrefix;
				this.prefixes.push(newPrefix.description);
			});
		},
		addSufix(sufix) {
			this.sufixes.push(sufix);
		},
		removeSufix(sufix) {
			this.sufixes.splice(this.sufixes.indexOf(sufix), 1);
		},
		removePrefix(prefix) {
			this.prefixes.splice(this.prefixes.indexOf(prefix), 1);
		},
		getPrefixes() {
			axios({
				url: "http://localhost:4000",
				method: "post",
				data: {
					query: `
                {
                    prefixes {
                        id
                        type
                        description
                    }                   
                }
                `
				}
			}).then(response => {
				const query = response.data;
				this.prefixes = query.data.prefixes.map(prefix => prefix.description);
				//this.sufixes = query.data.sufixes.map(sufix => sufix.description);
			});
		},
		getSufixes() {
			axios({
				url: "http://localhost:4000",
				method: "post",
				data: {
					query: `
                {
                    sufixes {
                        description
                    }
                }
                `
				}
			}).then(response => {
				const query = response.data;
				//this.prefixes = query.data.prefixes.map(prefix => prefix.description);
				this.sufixes = query.data.sufixes.map(sufix => sufix.description);
			});
		}
	},
	computed: {
		domains() {
			const domains = [];
			console.log("Gerando domínios...");
			for (const prefix of this.prefixes) {
				for (const sufix of this.sufixes) {
					const name = prefix + sufix;
					const url = name.toLowerCase();
					const checkout = "https://cart.hostgator.com.br/?pid=d&sld=" + url + "&tld=.com.br&domainCycle=2";
					domains.push({
						name,
						checkout
					});
				}
			}
			return domains;
		}
	},
	created() {
		this.getPrefixes();
		this.getSufixes();
	}
};
</script>

<style>
</style>
