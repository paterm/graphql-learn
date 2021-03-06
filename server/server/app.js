const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const cors = require('cors');

const app = express();
const PORT = 3005;

app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, err => console.log(err ? err : 'Server started!'));
