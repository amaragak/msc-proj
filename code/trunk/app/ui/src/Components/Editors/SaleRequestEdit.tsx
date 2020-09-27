import React from "react";
import { AutocompleteInput } from "../../Components/Input/AutocompleteInput";
import { InputDialog } from "../../Components/Input/InputDialog";
import { UserInfo, Users } from "../../Types/UserInfo";
import { UserState } from "../../Redux/State/UserState";
import Ledger from "@daml/ledger";
import { httpBaseUrl, wsBaseUrl } from "../../config";
import { Product } from "@daml.js/app-0.0.1/lib/Product";
import { getProductKey } from "../../Types/Product";
import { validateNumericString } from "../../Utils/ValidateNumericString";
import { PriceInput } from "../../Components/Input/PriceInput";
import { SaleRequestEditHeader } from "../DataDisplay/EditHeaders/SaleRequestEditHeader"

interface SaleRequestEditProps {
  open: boolean;
  onClose: () => void;
  user: UserState;
  product: Product;
}

interface SaleRequestEditState {
  buyer: string;
  price: string;
  currency: string;
  validationError: boolean;
}

export class SaleRequestEdit extends React.Component<SaleRequestEditProps, SaleRequestEditState> {
  constructor(props: SaleRequestEditProps) {
    super(props);
    this.state = this.initialState();
  }

  private initialState(): SaleRequestEditState {
    return {
      buyer: "",
      price: "",
      currency: "",
      validationError: false
    }
  }
  
  private putToLedger = () => {
    if (!this.props.user.loggedIn) return;
    this.setState({ validationError: false });
    const { product } = this.props;
    const { buyer, price, currency } = this.state;
    const ledger = new Ledger({ token: this.props.user.token, httpBaseUrl, wsBaseUrl });
    const productKey = getProductKey(product);
    const choiceArgs = { buyer, price, currency }
    ledger.exerciseByKey(Product.MakeSaleRequest, productKey, choiceArgs)
      .then(() => this.onClose());
  }

  private onClose = () => {
    this.setState({ validationError: false });
    this.props.onClose();
  }

  private onOkay = () => {
    const { buyer, price, currency } = this.state;
    if (!!buyer && !!price && !!currency && validateNumericString(price)) this.putToLedger();
    else this.setState({ validationError: true });
  }
  
  renderInputs() {
    const { user, product } = this.props;
    const { validationError, buyer } = this.state;
    if (!user.loggedIn) return null
    return (
      <>
        <SaleRequestEditHeader product={product}/>
        <AutocompleteInput<UserInfo>
          label="Buyer"
          options={Users.filter(u => u.username !== user.username)}
          onChange={value => this.setState({ ...this.state, buyer: value && value.username })}
          getOptionLabel={option => option.username}
          error={validationError && !buyer}
        />
        <PriceInput
          onChangePrice={value => this.setState({ ...this.state, price: value })}
          onChangeCurrency={value => this.setState({ ...this.state, currency: value })}
          currencyOptions={["£", "$", "€"]}
          currency={this.state.currency}
          priceLabel="Price"
          currencyLabel="Currency"
          currencyDisabled={false}
          priceError={validationError && (!this.state.price || !validateNumericString(this.state.price))}
          currencyError={validationError && !this.state.currency}
        />
      </>
    );
  }
  
  render() {
    return (
      <InputDialog
        title="Offer Item"
        children={this.renderInputs()}
        open={this.props.open}
        onOkay={this.onOkay}
        onCancel={this.onClose}
        onEnter={() => this.setState(this.initialState())}
      />
    );
  }
}
