import { check } from "express-validator";
import BrandsModel from "../models/brands.model";
import { Request, Response, NextFunction } from "express";
import { TypeBrands } from "../types/brands.interface";
import { handlerValidator } from "../utils/handler.validator";

const BrandsCreationValidator = [
  check("name")
    .exists()
    .withMessage("Debes especificar el nombre de la marca.")
    .notEmpty()
    .withMessage("El nombre de la marca no puede estar vacia.")
    .isString()
    .withMessage("El nombre de la marca debe ser un string.")
    .isLength({ min: 1, max: 90 })
    .withMessage(
      "El nombre del marca debe tener entre 1 y máximo 90 caracteres."
    )
    .custom(async (value: string, { req }) => {
      const { id } = req.params as any; // get param user to edit

      // validate if value is valid with regex
      const isValidValue = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ]+$/.test(value);
      if (!isValidValue) {
        throw new Error(
          "El nombre de la marca solo puede tener letras y números"
        );
      }

      // validate if is already exists
      const brand = await BrandsModel.findOne({
        name: value,
      });
      if (brand && brand.id !== id) {
        throw new Error("La marca ya existe");
      }
      return true;
    }),
  check("type")
    .notEmpty()
    .withMessage("El tipo de marca es obligatorio")
    .isString()
    .withMessage("El tipo de marca debe ser una cadena de texto.")
    .custom(async (value: string) => {
      const types = Object.keys(TypeBrands);
      if (!types.includes(value)) {
        throw new Error(
          `El tipo de marca debe ser una de las siguientes opciones: ${types.join(
            ", "
          )}.`
        );
      }
      return true;
    }),
  check("is_active").optional(),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

const BrandIdValidator = [
  check("id")
    .exists()
    .withMessage("El id de la marca es requerido.")
    .notEmpty()
    .withMessage("El id de la marca no puede estar vacio.")
    .isString()
    .withMessage("El id de la marca debe ser una cadena de texto.")
    .isMongoId()
    .withMessage("El id de la marca debe ser un id de mongo.")
    .custom(async (id: string) => {
      const brand = await BrandsModel.findById(id);
      if (!brand) {
        throw new Error("El marca no existe");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export { BrandsCreationValidator, BrandIdValidator };
