import type { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.js';
import type { CreateProductDTO, UpdateProductDTO } from '../interfaces/product.interface.js';


export const addProduct = async (
  req: Request<{}, {}, CreateProductDTO>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Loosened type to avoid complex TS typing issues with dynamic filters
    const query: any = {};

    // Category filter (case-insensitive)
    if (typeof req.query.category === 'string') {
      query.category = {
        $regex: new RegExp(`^${req.query.category.trim()}$`, 'i'),
      };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductDTO>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    Object.assign(product, req.body);

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};
