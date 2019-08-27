const graphql = require('graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;
const Movies = require('../db/models/movie');
const Directors = require('../db/models/director');

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLNonNull(GraphQLString) },
    rate: { type: GraphQLInt },
    watched: { type: GraphQLNonNull(GraphQLBoolean) },
    director: {
      type: DirectorType,
      resolve({ directorId }) {
        return Directors.findById(directorId);
      }
    }
  })
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLNonNull(GraphQLInt) },
    movies: {
      type: GraphQLList(MovieType),
      resolve({ id }) {
        return Movies.find({ directorId: id });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(_, { name, age }) {
        const director = new Directors({ name, age });
        return director.save();
      }
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: {type: GraphQLID } },
      resolve(_, { id }) {
        return Directors.findByIdAndRemove(id);
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(_, { name, age }) {
        return Directors.findByIdAndUpdate(
          args.id,
          { $set: { name, age } },
          { new: true }
        )
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        rate: { type: GraphQLInt },
        watched: { type: GraphQLNonNull(GraphQLBoolean) }
      },
      resolve(_, { name, genre, directorId, rate, watched }) {
        const movie = new Movies({
          name,
          genre,
          directorId,
          rate,
          watched
        });
        return movie.save();
      }
    },
    deleteMovie: {
      type: MovieType,
      args: { id: {type: GraphQLID } },
      resolve(_, { id }) {
        return Movies.findByIdAndRemove(id);
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        rate: { type: GraphQLInt },
        watched: { type: GraphQLNonNull(GraphQLBoolean) }
      },
      resolve(_, { name, genre, directorId, rate, watched }) {
        return Movies.findByIdAndUpdate(
          args.id,
          { $set: { name, genre, directorId, rate, watched }},
          { new: true }
        )
      }
    }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID }},
      resolve(_, { id }) {
        return Movies.findById(id);
      }
    },
    movies: {
      type: GraphQLList(MovieType),
      resolve() {
        return Movies.find({});
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID }},
      resolve(_, { id }) {
        return Directors.findById(id);
      }
    },
    directors: {
      type: GraphQLList(DirectorType),
      resolve() {
        return Directors.find({});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
