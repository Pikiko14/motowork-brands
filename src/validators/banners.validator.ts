import { check } from "express-validator";
import BannersModel from "../models/banners.model";
import { TypeBanner } from "../types/banners.interface";
import { NextFunction, Request, Response } from "express";
import { handlerValidator } from "../utils/handler.validator";

const BannersCreationValidator = [
  check("name")
    .exists()
    .withMessage("El nombre del banner es requerido.")
    .notEmpty()
    .withMessage("El nombre del banner no puede estar vacio.")
    .isString()
    .withMessage("El nombre del banner debe ser una cadena de texto.")
    .isLength({ min: 5, max: 90 })
    .withMessage(
      "El nombre del banner debe tener entre 5 y máximo 90 caracteres."
    )
    .custom(async (value: string) => {
      const isValidValue = /^[a-zA-Z0-9 ]+$/.test(value);
      if (!isValidValue) {
        throw new Error(
          "El nombre del banner solo puede tener letras y números"
        );
      }
      return true;
    }),
  check("link")
    .exists()
    .withMessage("El link del banner es requerido.")
    .notEmpty()
    .withMessage("El link del banner no puede estar vacio.")
    .isString()
    .withMessage("El link del banner debe ser una cadena de texto.")
    .isLength({ min: 5, max: 160 })
    .withMessage(
      "El link del banner debe tener entre 5 y máximo 160 caracteres."
    )
    .custom(async (value: string) => {
      const isValidValue =
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*$/.test(
          value
        );
      if (!isValidValue) {
        throw new Error("El link del banner debe ser una url válida.");
      }
      return true;
    }),
  check("type")
    .exists()
    .withMessage("El tipo del banner es requerido.")
    .notEmpty()
    .withMessage("El tipo del banner no puede estar vacio.")
    .isString()
    .withMessage("El tipo del banner debe ser una cadena de texto.")
    .isLength({ min: 1, max: 10 })
    .withMessage(
      "El tipo del banner debe tener entre 1 y máximo 10 caracteres."
    )
    .custom(async (value: string) => {
      const types = Object.keys(TypeBanner);
      if (!types.includes(value)) {
        throw new Error(
          `El link del banner debe ser una de las siguientes opciones: ${types.join(
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

const BannerIdValidator = [
  check("id")
    .exists()
    .withMessage("El id del banner es requerido.")
    .notEmpty()
    .withMessage("El id del banner no puede estar vacio.")
    .isString()
    .withMessage("El id del banner debe ser una cadena de texto.")
    .isMongoId()
    .withMessage("El id del banner debe ser un id de mongo.")
    .custom(async (id: string) => {
      const banner = await BannersModel.findById(id);
      if (!banner) {
        throw new Error("El banner no existe");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) =>
    handlerValidator(req, res, next),
];

export { BannersCreationValidator, BannerIdValidator };
