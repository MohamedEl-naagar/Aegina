import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLFloat } from 'graphql';
import mongoose from 'mongoose';
import productModel from '../../db/models/product.model.js';
import commentModel from './commentModel.js';

// Define a UserStatsType to return the aggregated data
const UserStatsType = new GraphQLObjectType({
  name: 'UserStats',
  fields: {
    totalProducts: { type: GraphQLInt },
    totalComments: { type: GraphQLInt },
    totalPrice: { type: GraphQLFloat },
  },
});

// Define the RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    userStats: {
      type: UserStatsType,
      args: {
        createdBy: { type: GraphQLString },  // Assuming createdBy is a string representation of ObjectId
      },
      resolve: async (parent, args) => {
        const { createdBy } = args;
        const createdByObjectId = new mongoose.Types.ObjectId(createdBy);

        // Fetch total products
        const totalProducts = await productModel.countDocuments({ createdBy: createdByObjectId });

        // Fetch total comments
        const totalComments = await commentModel.countDocuments({ createdBy: createdByObjectId });

        // Fetch total price
        const products = await productModel.find({ createdBy: createdByObjectId });
        const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

        return {
          totalProducts,
          totalComments,
          totalPrice,
        };
      },
    },
  },
});

// Export the schema
export const schema = new GraphQLSchema({
  query: RootQuery,
});
