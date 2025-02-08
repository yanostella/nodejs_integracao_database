import { IUser } from '@/entities/models/user.interface';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { IUserRepository } from '@/repositories/user.repository.interface';
import { IPerson } from '@/entities/models/person.interface';

export class FindWithPersonUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(userId: number): Promise<(IUser & IPerson) | undefined> {
    const user = await this.userRepository.findWithPerson(userId);
    console.log(user);
    if (!user) throw new ResourceNotFoundError();

    return user;
  }
}
