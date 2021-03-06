import { ApolloServer, gql } from 'apollo-server-micro'
import UserAPI from '../../database/user'
import PostAPI from '../../database/post';
import CommentAPI from '../../database/comment';
import typeDefs from '../../graphql/schema';
import CommentVoteAPI from '../../database/commentVote';
import PostVoteAPI from '../../database/postVote';

const resolvers = require('../../graphql/resolvers');

const apolloServer = new ApolloServer({ typeDefs, resolvers, dataSources: () => ({
    userAPI: new UserAPI(),
    postAPI: new PostAPI(),
    commentAPI: new CommentAPI(),
    commentVoteAPI: new CommentVoteAPI(),
    postVoteAPI: new PostVoteAPI()
  }),
  context: ({ req: MicroRequest, res: ServerResponse }) => {
    const user = MicroRequest.cookies.username;
    const token = MicroRequest.cookies.token;
    if (!token) return { user: null };
    // verify a token symmetric - synchronous
    var jwt = require('jsonwebtoken');
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded " + JSON.stringify(decoded));
    return { user: decoded.username };
  }
})

const startServer = apolloServer.start()

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}