import { AddressRepository } from '@/repositories/pg/address.repository';
import { CreateAddressUseCase } from '../create-address';

export function makeCreateAdressUseCase() {
  const adressRepository = new AddressRepository();
  const createAdressUseCase = new CreateAddressUseCase(adressRepository);

  return createAdressUseCase;
}
