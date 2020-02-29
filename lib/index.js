"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const serviceAccount = require('../service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const apollo_server_1 = require("apollo-server");
// interface Tweet {
//     id: string;
//     name: string;
//     screenName: string;
//     statusesCount: number;
//     CustomerId: string;
// }
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
        // async tweets() {
        //     const tweets = await admin
        //         .firestore()
        //         .collection('tweets')
        //         .get();
        //     return tweets.docs.map(tweet => tweet.data()) as Tweet[];
        // },
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
    // Customer: {
    //     async tweets(Customer) {
    //         try {
    //             const CustomerTweets = await admin
    //                 .firestore()
    //                 .collection('tweets')
    //                 .where('CustomerId', '==', Customer.id)
    //                 .get();
    //             return CustomerTweets.docs.map(tweet => tweet.data()) as Tweet[];
    //         } catch (error) {
    //             throw new ApolloError(error);
    //         }
    //     }
    // },
    // Tweets: {
    //     async Customer(tweet) {
    //         try {
    //             const tweetAuthor = await admin
    //                 .firestore()
    //                 .doc(`Customers/${tweet.CustomerId}`)
    //                 .get();
    //             return tweetAuthor.data() as Customer;
    //         } catch (error) {
    //             throw new ApolloError(error);
    //         }
    //     }
    // }
};
const server = new apollo_server_1.ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
});

server.listen({ port: process.env.PORT || 8080 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
