"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const serviceAccount = require('../service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const apollo_server_1 = require("apollo-server");
const typeDefs = apollo_server_1.gql `
  type Customer {
    id:ID!
    nic: String!
    name: String!
    gender: String!
    dob: String!
}
type Lab {
    id:ID!
    name: String!
}

  type Query {
    Customer(id:String): Customer
    Lab(id:String!): Lab
  }
`;
const resolvers = {
    Query: {
        async Customer(_, args) {
            try {
                const CustomerDoc = await admin
                    .firestore()
                    .doc(`labs/hsfiY8YtyANYwhQvZAQf/customers/${args.id}`)
                    .get();
                const Customer = CustomerDoc.data();
                return Customer || new apollo_server_1.ValidationError('Customer ID not found');
            }
            catch (error) {
                throw new apollo_server_1.ApolloError(error);
            }
        },
        async Lab(_, args) {
            try {
                const LabDoc = await admin
                    .firestore()
                    .doc(`labs/${args.id}`)
                    .get();
                const Lab = LabDoc.data();
                return Lab || new apollo_server_1.ValidationError('Lab ID not found');
            }
            catch (error) {
                throw new apollo_server_1.ApolloError(error);
            }
        }
    }
};
const server = new apollo_server_1.ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
});

server.listen({ port: process.env.PORT || 8080 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
