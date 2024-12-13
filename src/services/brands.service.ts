import { Response } from "express";
import { Utils } from "../utils/utils";
import { TaskQueue } from '../queues/cloudinary.queue';
import { CloudinaryService } from "./cloudinary.service";
import { ResponseHandler } from "../utils/responseHandler";
import { BrandsInterface } from "../types/brands.interface";
import { PaginationInterface } from "../types/req-ext.interface";
import BrandsRepository from "../repositories/brands.repository";
import { ResponseRequestInterface } from "../types/response.interface";

export class BrandsService extends BrandsRepository {
  private utils: Utils;
  public path: String;
  public queue: any;
  public folder: string = "brands";
  public cloudinaryService: CloudinaryService;

  constructor(
  ) {
    super();
    this.path = "/brands/";
    this.utils = new Utils();
    this.queue = new TaskQueue('cloudinary');
    this.queue.setupListeners();
    this.cloudinaryService = new CloudinaryService();
  }

  /**
   * Create brands
   * @param { Response } res Express response
   * @param { BrandsInterface } body BrandsInterface
   * @param { Express.Multer.File } file Express.Multer.File
   */
  public async createBrands(
    res: Response,
    body: BrandsInterface,
    file: Express.Multer.File
  ): Promise<void | ResponseHandler> {
    try {
      // validate file
      const brand = (await this.create(body)) as BrandsInterface;

      // set file
      if (file) {
        // execute queue for upload
        await this.queue.addJob(
          { taskType: 'uploadFile', payload: { file, brand } },
          {
            attempts: 3,
            backoff: 5000,
          }
        );
      }

      // return response
      return ResponseHandler.successResponse(
        res,
        brand,
        "Marca creada correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * List brands
   * @param { Response } res Express response
   * @param { PaginationInterface } query query of list
   * @return { Promise<void | ResponseRequestInterface> }
   */
  public async getBrands(
    res: Response,
    query: PaginationInterface
  ): Promise<void | ResponseHandler> {
    try {
        // validamos la data de la paginacion
      const page: number = (query.page as number) || 1;
      const perPage: number = (query.perPage as number) || 7;
      const skip = (page - 1) * perPage;

      // Iniciar busqueda
      let queryObj: any = {};
      if (query.search) {
        const searchRegex = new RegExp(query.search as string, "i");
        queryObj = {
          $or: [
            { name: searchRegex },
          ],
        };
      }

      // validate is active
      if (query.is_active) {
        queryObj.is_active = query.is_active;
      }

      // type brand
      if (query.type) {
        queryObj.type = query.type;
      }

      // do query
      const fields = query.fields ? query.fields.split(',') : [];
      const brands = await this.paginate(queryObj, skip, perPage, query.sortBy, query.order, fields);

      // return data
      return ResponseHandler.successResponse(
        res,
        {
          brands: brands.data,
          totalItems: brands.totalItems,
          totalPages: brands.totalPages,
        },
        "Listado de marcas."
      );

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Show brand
   * @param { Response } res Express response
   * @param { string } id query of list
   * @return { Promise<void | ResponseRequestInterface> }
   */
  public async showBrand(
    res: Response,
    id: string
  ): Promise<void | ResponseHandler> {
    try {
      // get brand
      const showBrand = await this.findOneByQuery({ _id: id });

      // return data
      return ResponseHandler.successResponse(
        res,
        showBrand,
        "Información de la marca."
      );

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Delete brand
   * @param { Response } res Express response
   * @param { string } id query of list
   * @return { Promise<void | ResponseRequestInterface> }
   */
  public async deleteBrand(
    res: Response,
    id: string
  ): Promise<void | ResponseHandler> {
    try {
      // get brand
      const brand = await this.delete(id);

      // return data
      return ResponseHandler.successResponse(
        res,
        brand,
        "Marca eliminada correctamente."
      );

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Update brand
   * @param { Response } res Express response
   * @param { string } id query of list
   * @param { BrandsInterface } body BrandsInterface
   * @param { Express.Multer.File } file Express.Multer.File
   */
  public async updateBrands(
    res: Response,
    id: string,
    body: BrandsInterface,
    file: Express.Multer.File
  ) {
    try {
      // validate file
      const brand = await this.update(id, body) as BrandsInterface;

      // set file
      if (file) {
        // delete old icon
        if (brand.icon) {
          await this.queue.addJob(
            { taskType: 'deleteFile', payload: { icon: brand.icon } },
            {
              attempts: 3,
              backoff: 5000,
            }
          );
        }

        // upload new file
        await this.queue.addJob(
          { taskType: 'uploadFile', payload: { file, brand } },
          {
            attempts: 3,
            backoff: 5000,
          }
        );
      }

      // return response
      return ResponseHandler.successResponse(
        res,
        brand,
        "Marca modificada correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Change brand status
   * @param { Response } res Express response
   * @param { string } id query of list
   * @param { BrandsInterface } body BrandsInterface
   * @param { Express.Multer.File } file Express.Multer.File
   */
  public async changeBrandStatus(
    res: Response,
    id: string
  ) {
    try {
      // validate file
      const brand = await this.findOneByQuery({ _id: id });

      // update status
      if (brand) {
        brand.is_active = !brand.is_active;
        await this.update(brand._id, brand);
      }

      // return response
      return ResponseHandler.successResponse(
        res,
        brand,
        "Estado cambiado correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
