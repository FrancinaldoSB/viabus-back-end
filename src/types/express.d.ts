import 'express';

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      name: string;
      companies: any[];
      currentCompany?: any;
    }

    interface Request {
      user?: User;
    }
  }
}
