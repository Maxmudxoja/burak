import ProductModel from "../schema/Product_model";

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }
}

export default ProductService;
