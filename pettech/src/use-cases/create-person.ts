import { IPerson } from '@/entities/models/person.interface';
import { IPersonRepository } from '@/repositories/person.repository.interface';

export class CreatePersonUseCase {
  constructor(private personRepository: IPersonRepository) {}

  handler(person: IPerson): Promise<IPerson | undefined> {
    return this.personRepository.create(person);
  }
}
