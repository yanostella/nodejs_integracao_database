import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { IProduct } from '../schemas/models/product.interface';

@Injectable()
export class StockService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllStock(limit: number, page: number) {
    return this.productRepository.getAllStock(limit, page);
  }

  async getStock(productId: string) {
    return this.productRepository.getStock(productId);
  }

  async createStock(product: IProduct) {
    return this.productRepository.createStock(product);
  }

  async updateStock(productId: string, stock: number) {
    return this.productRepository.updateStock(productId, stock);
  }

  async deleteStock(productId: string) {
    return this.productRepository.deleteStock(productId);
  }
}
