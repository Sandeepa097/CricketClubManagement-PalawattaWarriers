interface InputText {
  placeholder: string;
}

interface InputSwitch {
  textOn: string;
  textOff: string;
}

interface ChildPropertyText extends InputText {
  type: 'text';
  name: string;
}

interface ChildPropertySwitch extends InputSwitch {
  type: 'switch';
  name: string;
}

interface ChildItemValues {
  id: string | number;
  values: object;
}
