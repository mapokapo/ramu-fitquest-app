type AsyncValue<T> =
  | {
      loaded: true;
      data: T;
    }
  | {
      loaded: false;
    };

export default AsyncValue;
