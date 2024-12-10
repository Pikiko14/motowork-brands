import { Model } from "mongoose";
import BrandsModel from "../models/brands.model";
import { BrandsInterface } from "../types/brands.interface";
import { PaginationResponseInterface } from "../types/response.interface";

class BrandsRepository {
  private readonly model: Model<BrandsInterface>;

  constructor() {
    this.model = BrandsModel;
  }

  /**
   * Find model by query
   * @param query
   * @returns
   */
  public async findOneByQuery(query: any): Promise<BrandsInterface | null> {
    return await this.model.findOne(query);
  }

  /**
   * Save brand in bbdd
   * @param user User
   */
  public async create(
    brand: BrandsInterface
  ): Promise<BrandsInterface> {
    const brandBd = await this.model.create(brand);
    return brandBd;
  }

  /**
   * Update brand data
   * @param id
   * @param body
   */
  public async update(
    id: string | undefined,
    body: BrandsInterface
  ): Promise<BrandsInterface | void | null> {
    return await this.model.findByIdAndUpdate(id, body, { new: true });
  }

  /**
   * Paginate brands
   * @param query - Query object for filtering results
   * @param skip - Number of documents to skip
   * @param perPage - Number of documents per page
   * @param sortBy - Field to sort by (default: "name")
   * @param order - Sort order (1 for ascending, -1 for descending, default: "1")
   */
  public async paginate(
    query: Record<string, any>,
    skip: number,
    perPage: number,
    sortBy: string = "name",
    order: any = "-1"
  ): Promise<PaginationResponseInterface> {
    try {
      // Parse sort order to ensure it is a number

      const validSortFields = ["name", "createdAt"];
      if (!validSortFields.includes(sortBy)) {
        throw new Error(`Invalid sort field. Allowed fields are: ${validSortFields.join(", ")}`);
      }

      // Fetch paginated data
      const brands = await this.model
        .find(query)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(perPage);

      // Get total count of matching documents
      const totalBrands = await this.model.countDocuments(query);

      // Calculate total pages
      const totalPages = Math.ceil(totalBrands / perPage);

      return {
        data: brands,
        totalPages,
        totalItems: totalBrands,
      };
    } catch (error: any) {
      throw new Error(`Pagination failed: ${error.message}`);
    }
  }

  /**
   * Delete brand by id
   * @param id
   */
  public async delete(id: string): Promise<BrandsInterface | void | null> {
    return this.model.findByIdAndDelete(id);
  }
}

export default BrandsRepository;
