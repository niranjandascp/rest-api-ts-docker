import express, { Router } from 'express';
import { addProduct, getProducts, updateProduct } from '../controllers/productConrtoller.js';


const productRoutes: Router = express.Router({ mergeParams: true });

productRoutes.post('/', addProduct);

productRoutes.get('/', getProducts);

productRoutes.patch('/:id', updateProduct);




export default productRoutes;   