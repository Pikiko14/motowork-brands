import { Schema, model, Types } from "mongoose";
import {
  BrandsInterface,
  TypeBrands,
} from "../types/brands.interface";
import { TaskQueue } from '../queues/cloudinary.queue';

const BrandsSchema = new Schema<BrandsInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: "",
    },
    is_active: {
      type: Boolean,
      required: false,
      default: true,
    },
    type: {
      type: String,
      enum: Object.values(TypeBrands),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BrandsSchema.index({ type: 1 }); // Índice para el campo type

// propiedades virtuales para calcular los count_news
BrandsSchema.virtual("count_items").get(() => {
  const count = 1;
  return count;
});

BrandsSchema.set("toObject", { virtuals: true });
BrandsSchema.set("toJSON", { virtuals: true });

// Middleware para eliminar imágenes antes de borrar un documento
BrandsSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next: any) {
    const queue = new TaskQueue('cloudinary');
    queue.setupListeners();
    const category: BrandsInterface = await this.model
      .findOne(this.getQuery())
      .exec();
    try {
      if (category.icon) {
        await queue.addJob(
          { taskType: 'deleteFile', payload: { icon: category.icon } },
          {
            attempts: 3,
            backoff: 5000,
          }
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);

const BrandsModel = model<BrandsInterface>(
  "brands",
  BrandsSchema
);

export default BrandsModel;
