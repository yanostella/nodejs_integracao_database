import { FastifyInstance } from 'fastify';
import { create } from './create';
import { findUser } from './find-user';
import { signIn } from './signin';

export async function userRoutes(app: FastifyInstance) {
  app.post('/user', create);
  app.get('/user/:id', findUser);
  app.post('/user/signin', signIn);
}
