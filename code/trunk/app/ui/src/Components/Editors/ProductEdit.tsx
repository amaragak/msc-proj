import React from "react";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { TextInput } from "../../Components/Input/TextInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { Product  } from "@daml.js/app-0.0.1/lib/Product";
import { ProductType, RawProductTypes, unitToString } from "../../Types/ProductType";
import { emptyProduct, validateNewProduct, prepareProductForLedger } from "../../Types/Product";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { ProductEditHeader } from "../DataDisplay/EditHeaders/ProductEditHeader";

interface ProductEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  allProducts: Product[];
}

interface ProductEditState {
  product: Product;
  validationError: boolean;
}

export class ProductEdit extends React.Component<ProductEditProps, ProductEditState> {
  constructor(props: ProductEditProps) {
    super(props);
    this.state = { product: emptyProduct(props.user), validationError: false };
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    ledger.create(Product, prepareProductForLedger(product))
      .then(() => this.props.onClose());
  }

  private onOkay = () => {
    const { product } = this.state;
    if (validateNewProduct(product)) this.putToLedger();
    else this.setState({ validationError: true });
  }

  private updateProduct(updateMember: (product: Product) => void) {
    let product: Product = { ...this.state.product };
    updateMember(product);
    this.setState({ product });
  }
  
  renderInputs() {
    const { user } = this.props;
    const { validationError, product } = this.state;
    if (!user.loggedIn) return null
    return (
      <>
        <ProductEditHeader product={product} />
        <AutocompleteInput<ProductType>
          label="Product Type"
          options={RawProductTypes}
          onChange={value => this.updateProduct(product => {
            product.productInfo.typeId = value && value.identifier;
            product.productInfo.amount.unit = value && unitToString(value.unit);
          })}
          getOptionLabel={(option) => option.name}
          error={validationError && !product.productInfo.typeId}
        />
        <TextInput
          label="Description"
          onChange={value => this.updateProduct(product => product.description = value)}
          error={validationError && !product.description}
          placeholder="E.g. Orange Juice for Tesco"
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="New Raw Product"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.props.onClose}
        onEnter={() => this.setState({ product: emptyProduct(this.props.user), validationError: false })}
      />
    );
  }
}
