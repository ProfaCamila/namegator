const { ApolloServer } = require("apollo-server");
const dns = require("dns");

const typeDefs = `
    
    type Item {
        id: Int
        type: String
        description: String
    }

    type Domain {
        name: String
        checkout: String
        available: Boolean
    }

   
    type Query {
        prefixes: [Item]
        sufixes: [Item]
    }
    
    input ItemInput {
        type: String
        description: String
    }
    type Mutation {
        saveItem(item: ItemInput): Item
        deleteItem(id: Int): Boolean
        generateDomains: [Domain]
    }

`;

const items= [
    { id: 1, type: "prefix", description: "Air" },
    { id: 2, type: "prefix", description: "Jet" },
    { id: 3, type: "prefix", description: "Flight" },
    { id: 4, type: "sufix", description: "Hub" },
    { id: 5, type: "sufix", description: "Station" },
    { id: 6, type: "sufix", description: "Mart" },
];

const isDomainAvailable = function (url) {
    return new Promise(function (resolve, reject) {
        dns.resolve(url, function(error) {
            if (error) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });    
};

const resolvers = {
    Query: {
        prefixes() {
            return items.filter(item => item.type === "prefix");
        },
        sufixes() {
            return items.filter(item => item.type === "sufix");
        }
    },
    Mutation: {
        saveItem(_, args) {
            const item = args.item; //recebe os dados do front end
            item.id = Math.floor(Math.random() * 1000);
            items.push(item);
            return item;
        },
        deleteItem(_, args) {
            const id = args.id;
            console.log("ID Deletado:" +id);
            const item = items.find(item => item.id === id);
            if (!item) return false;
            items.splice(items.indexOf(item), 1);
            return true;
        },
        async generateDomains() {
            const domains = [];
			console.log("Gerando domínios no servidor...");
			for (const prefix of items.filter(item => item.type === "prefix")) {
				for (const sufix of items.filter(item => item.type === "sufix")) {
					const name = prefix.description + sufix.description;
					const url = name.toLowerCase();
					const checkout = "https://cart.hostgator.com.br/?pid=d&sld=" + url + "&tld=.com.br&domainCycle=2";
                    const available = await isDomainAvailable(`${url}.com.br`);
					domains.push({
						name,
						checkout,
                        available
					});
				}
			}
            return domains;
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});
server.listen();

