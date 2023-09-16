import { networkInterfaces } from "node:os";

interface GetHostIPsOpts {
  includeLocalhost?: boolean;
}
export function getHostIPs({ includeLocalhost = true }: GetHostIPsOpts = {}) {
  const nets = networkInterfaces();
  const results: {
    [key: string]: string[]
  } = {};

  Object.entries(nets).forEach(([name, nets]) => {
    if (!nets) return;
    nets.forEach((net) => {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family !== "IPv4") return;
      if (net.internal && !includeLocalhost) return;
      if (!results[name]) results[name] = [];
      results[name].push(net.address);
    })
  })

  return results;
}

export function getHostIPsShort(opts: GetHostIPsOpts = {}) {
  return Object.values(getHostIPs(opts)).flat()
}