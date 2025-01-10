type AsyncValue<T> =
  | {
      value: any;
      loaded: true;
      data: T;
    }
  | {
      loaded: false;
    };

export default AsyncValue;
