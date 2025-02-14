class CustomError extends Error {
    public statusCode: number;
    public data: any;
  
    constructor(message: string, statusCode: number, data: any = null) {
      super(message);
      this.statusCode = statusCode;
      this.data = data;
    }
}
  
export { CustomError };