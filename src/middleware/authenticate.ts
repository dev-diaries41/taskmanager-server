import { NextFunction, Request, Response } from "express";
import { Auth } from "../mongo/models/auth";
import { hash } from "../utils/cryptography";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['api-key'];

  if(!apiKey){
    return res.status(401).json({ error: 'Missing API key' });
  }

  const hashedApiKey = hash(apiKey as string);
  const document = await Auth.findOne({hashedApiKey});

  //hashedApiKey is an index so finding one means that api key is valid
  if (document?.hashedApiKey) {
    next(); // Request is authorized
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export {authenticate};
