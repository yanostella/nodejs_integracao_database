import { AddressRepository } from '@/repositories/pg/address.repository';
import { FindAdressByPersonUseCase } from '../find-adress-by-person';

export function makeFindAdressByPersonUseCase() {
  const adressRepository = new AddressRepository();
  const findAdressByPersonUseCase = new FindAdressByPersonUseCase(
    adressRepository,
  );
  return findAdressByPersonUseCase;
}
