<template>
    <div>
        <div id="main">
            <div class="container">
                <div class="row">
                    <div class="col-md">
                        <AppItemList v-bind:items="items.prefix" v-on:addItem="addPrefix"
                            v-on:deleteItem="removePrefix">
                        </AppItemList>
                    </div>
                    <div class="col-md">
                        <AppItemList v-bind:items="items.sufix" v-on:addItem="addSufix" v-on:deleteItem="removeSufix">
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
                            <div class="col-md-6">
                                {{ domain.name }}                            
                            </div>
                            <div class="col-md-3">
                                <span>{{ (domain.available) ? "Disponível" : "Não Disponível" }}</span>                          
                            </div>
                            <div class="col-md-3 text-right">
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
			items: {
				prefix: [],
				sufix: []
			},
			domains: []
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
				this.items.prefix.push(newPrefix);
				this.generateDomains();
			});
		},
		addSufix(sufix) {
			//this.sufixes.push(sufix);
			axios({
				url: "http://localhost:4000",
				method: "post",
				data: {
					query: `
                        mutation ($item: ItemInput) {
                            newSufix: saveItem(item: $item) {
                                id
                                type
                                description
                            }
                        }
                    `,
					variables: {
						item: {
							type: "sufix",
							description: sufix
						}
					}
				}
			}).then(response => {
				const query = response.data;
				const newSufix = query.data.newSufix;
				this.items.sufix.push(newSufix);
				this.generateDomains();
			});
		},
		removeSufix(sufix) {
			// this.sufixes.splice(this.items.sufix.indexOf(sufix), 1);
			axios({
				url: "http://localhost:4000",
				method: "post",
				data: {
					query: `
                        mutation ($id: Int) {
                            deleted: deleteItem(id: $id)
                        }
                    `,
					variables: {
						id: sufix.id
					}
				}
			}).then(() => {
				Promise.all([
					this.getSufixes()
				]).then(() => {
					this.generateDomains();
				});
			});
		},
		removePrefix(prefix) {
			//this.prefixes.splice(this.prefixes.indexOf(prefix), 1);
			axios({
				url: "http://localhost:4000",
				method: "post",
				data: {
					query: `
                        mutation ($id: Int) {
                            deleted: deleteItem(id: $id)
                        }
                    `,
					variables: {
						id: prefix.id
					}
				}
			}).then(() => {
				Promise.all([
					this.getPrefixes()
				]).then(() => {
					this.generateDomains();
				});
			});
		},
		getPrefixes() {
			return axios({
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
				this.items.prefix = query.data.prefixes;
				//this.sufixes = query.data.sufixes.map(sufix => sufix.description);
			});
		},
		getSufixes() {
			return axios({
				url: "http://localhost:4000",
				method: "post",
				data: {
					query: `
                {
                    sufixes {
                        id
                        type
                        description
                    }
                }
                `
				}
			}).then(response => {
				const query = response.data;
				//this.prefixes = query.data.prefixes.map(prefix => prefix.description);
				this.items.sufix = query.data.sufixes;
			});
		},
		generateDomains() {
			axios({
				url: "http://localhost:4000",
				method: "post",
				data: {
					query: `
                        mutation {
                            domains: generateDomains {
                                name
                                checkout
                                available
                            }
                        }
                    `
				}
			}).then((response) => {
				const query = response.data;
				this.domains = query.data.domains;
			});
		}
	},

	created() {
		Promise.all([
			this.getPrefixes(), //As chamadas dessses métodos é realizada de forma assíncrona! Não respeita a ordem das chamadas
			this.getSufixes()
		]).then(() => {
			this.generateDomains(); //Usando promisses, os métodos definidos em 'then' serão executados após os métodos de promisses all
		});
	}
};
</script>

<style>
</style>
