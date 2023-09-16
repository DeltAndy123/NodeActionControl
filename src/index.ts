import express, {Express} from "express";
import { getHostIPsShort } from "./util/network";
import colorSupport from "color-support";
const supportsColor = colorSupport();
import c, {blueBright, bold, green, cyan} from "ansi-colors";
c.enabled = supportsColor && supportsColor.hasBasic;
// @ts-ignore
import { version } from "../package.json";

export class ActionControlServer {
  app: Express = express();
  port: number;

  constructor({ port = 5678, callback = () => {} }: ActionControlServerOpts = {}) {
    this.port = port;
    this.initialEndpoints();
    this.listen(port, callback);
  }

  private initialEndpoints() {
    this.app.get("/version", (req, res) => {
      res.send(version);
    })
  }
  private listen(port: number, callback: () => void = () => {}) {
    console.log(
      green(`Listening for requests on port ${bold(port.toString())}`) + "\n"
      + "Use one of the following to test HTTP/WebSocket server:"
    )
    this.app.listen(port, () => {
      getHostIPsShort().forEach((ip) => {
        console.log(" - " + blueBright(`http://${ip}:${cyan(port.toString())}/`));
      })
      callback();
    })
  }
}