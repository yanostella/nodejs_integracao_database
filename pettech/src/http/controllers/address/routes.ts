import { FastifyInstance } from 'fastify';
import { create } from './create';
import { findAdress } from './find-adress';

export async function addressRoutes(app: FastifyInstance) {
  app.post('/address', create);
  app.get('/address/person/:personId', findAdress);
}
