import axios from "axios";
import { Request, Response } from "express";
import config from "./config.json";

export const createHandler = (hostname: string, path: string, method: string) => {
  return async (req: Request, res: Response) => {
    try {
      const { data } = await axios({
        method,
        url: `${hostname}${path}`,
        data: req.body,
      });
      res.json(data);
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        return res.status(error.response?.status || 500).json(error?.response?.data);
      }

      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

export const configureRoutes = (app: any) => {
  Object.entries(config.services).forEach(([name, service]) => {
    const hostname = service.url;
    service.routes.forEach((route) => {
      route.methods.forEach((method) => {
        const handler = createHandler(hostname, route.path, method);
        app[method](`/api/${route.path}`, handler);
      });
    });
  });
};
