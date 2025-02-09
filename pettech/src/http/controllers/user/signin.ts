import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeSignInUseCase } from '@/use-cases/factory/make-signin-use-case';
import { compare } from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function signIn(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const { username, password } = registerBodySchema.parse(request.body);

  const signInUseCase = makeSignInUseCase();

  const user = await signInUseCase.handler(username);

  const doesThePasswordMatch = await compare(password, user.password);

  if (!doesThePasswordMatch) throw new InvalidCredentialsError();

  const token = await reply.jwtSign({ username });

  return reply.status(200).send({ token });
}
