import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ResponseHandler } from "../utils/responseHandler";
import { BrandsService } from "../services/brands.service";
import { BrandsInterface } from "../types/brands.interface";
import { ResponseRequestInterface } from "../types/response.interface";
import { PaginationInterface, RequestExt } from "../types/req-ext.interface";

export class BrandsController {
  public service;

  constructor() {
    this.service = new BrandsService();
  }

  /**
   * Create brands
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  createBrands = async (
    req: Request,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
      // get body
      const body = matchedData(req) as BrandsInterface;

      // store brand
      return await this.service.createBrands(
        res,
        body,
        req.file as Express.Multer.File
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message ?? error);
    }
  };

  /**
   * Get categories
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  getBrands = async (
    req: RequestExt,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
      // get query
      const query = matchedData(req) as PaginationInterface;

      // return data
      return await this.service.getBrands(res, query);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message ?? error);
    }
  };

  /**
   * Get brand
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  showBrand = async (
    req: RequestExt,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
      // get query
      const { id } = req.params;

      // return data
      return await this.service.showBrand(res, id);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message ?? error);
    }
  };

  /**
   * Delete brand
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  deleteBrand = async (
    req: RequestExt,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
      // get query
      const { id } = req.params;

      // return data
      return await this.service.deleteBrand(res, id);
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message ?? error);
    }
  };

  /**
   * Update brand
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  updateBrands = async (
    req: Request,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
      // get body
      const body = matchedData(req) as BrandsInterface;

      // get category params id
      const { id } = req.params;

      // store category
      return await this.service.updateBrands(
        res,
        id,
        body,
        req.file as Express.Multer.File
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message ?? error);
    }
  };

  /**
   * Change status brand
   * @param req Express request
   * @param res Express response
   * @returns Promise<void>
   */
  changeBrandStatus = async (
    req: Request,
    res: Response
  ): Promise<void | ResponseRequestInterface> => {
    try {
      // get brand params id
      const { id } = req.params;

      // store brand
      return await this.service.changeBrandStatus(
        res,
        id,
      );
    } catch (error: any) {
      ResponseHandler.handleInternalError(res, error, error.message ?? error);
    }
  };
}
