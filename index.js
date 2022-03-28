const server = require('fastify')({
  logger: true,
});
const fastifyAuth0 = require('fastify-auth0-verify');

const PORT = 3001;

// register - fastify-auth0-verify
server.register(fastifyAuth0, {
  domain: 'https://dev-c6aj47u9.us.auth0.com/',
  audience: 'platziMasterApiApi',
});

server.addHook('onRequest', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

server.get('/', {
  handler(request, reply) {
    reply.send(request.user);
  },
  preValidation: server.authenticate,
});

// Register routes to handle blog posts
const blogRoutes = require('./routes/blogs');

blogRoutes.forEach((route) => {
  const routeDecorator = { ...route, preValidation: server.authenticate };
  server.route(routeDecorator);
});

server.listen(PORT, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening on ${address}`);
});
