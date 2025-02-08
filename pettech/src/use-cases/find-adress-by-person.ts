import { IAddressRepository } from '@/repositories/address.repository.interface';
import { IAddress } from '@/entities/models/address.interface';
import { IPerson } from '@/entities/models/person.interface';

export class FindAdressByPersonUseCase {
  constructor(private adressRepository: IAddressRepository) {}

  async handler(
    personId: number,
    page: number,
    limit: number,
  ): Promise<(IAddress & IPerson)[]> {
    return this.adressRepository.findAdressByPersonId(personId, page, limit);
  }
}
